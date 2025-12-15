import graphene
import graphql_jwt
from django.contrib.auth import get_user_model, logout as django_logout

User = get_user_model()

class Signup(graphene.Mutation):
    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)

    user = graphene.Field(lambda: UserType)

    def mutate(self, info, username, password):
        if User.objects.filter(username=username).exists():
            raise Exception("Username already exists")
        user = User.objects.create_user(username=username, password=password)
        return Signup(user=user)

class UserType(graphene.ObjectType):
    id = graphene.ID()
    username = graphene.String()
    role = graphene.String()


class Login(graphql_jwt.JSONWebTokenMutation):
    user = graphene.Field(UserType)

    @classmethod
    def resolve(cls, root, info, **kwargs):
        user = info.context.user
        return cls(user=UserType(id=user.id, username=user.username, role=user.role))


class Logout(graphene.Mutation):
    ok = graphene.Boolean()

    def mutate(self, info):
        user = info.context.user
        if not user.is_authenticated:
            return Logout(ok=False)
        django_logout(info.context)
        return Logout(ok=True)

class Query(graphene.ObjectType):
    me = graphene.Field(UserType)
    users = graphene.List(UserType)

    def resolve_me(self, info):
        user = info.context.user
        if not user.is_authenticated:
            return None
        return UserType(id=user.id, username=user.username, role=user.role)

    def resolve_users(self, info):
        user = info.context.user
        if not user.is_authenticated:
            return []
        if getattr(user, "role", None) != "ADMIN":
            raise Exception("Not permitted")
        return [
            UserType(id=user.id, username=user.username, role=user.role)
            for user in User.objects.all()
        ]

class Mutation(graphene.ObjectType):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    login = Login.Field()
    logout = Logout.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
    signup = Signup.Field()