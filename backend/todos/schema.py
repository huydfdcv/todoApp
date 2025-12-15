import graphene
from graphene_django import DjangoObjectType
from .models import Todo

class TodoType(DjangoObjectType):
    class Meta:
        model = Todo
        fields = ("id", "title", "completed", "created_at")

class Query(graphene.ObjectType):
    my_todos = graphene.List(TodoType)

    def resolve_my_todos(self, info):
        user = info.context.user
        if not user.is_authenticated:
            return Todo.objects.none()
        return Todo.objects.filter(owner=user)


class UpdateTodo(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        title = graphene.String(required=False)
        completed = graphene.Boolean(required=False)

    todo = graphene.Field(TodoType)

    def mutate(self, info, id, title=None, completed=None):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication required")
        try:
            todo = Todo.objects.get(id=id, owner=user)
        except Todo.DoesNotExist:
            raise Exception("Todo not found")
        if title is not None:
            todo.title = title
        if completed is not None:
            todo.completed = completed
        todo.save()
        return UpdateTodo(todo=todo)


class DeleteTodo(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    ok = graphene.Boolean()

    def mutate(self, info, id):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication required")
        try:
            todo = Todo.objects.get(id=id, owner=user)
        except Todo.DoesNotExist:
            raise Exception("Todo not found")
        todo.delete()
        return DeleteTodo(ok=True)

class CreateTodo(graphene.Mutation):
    class Arguments:
        title = graphene.String(required=True)

    todo = graphene.Field(TodoType)

    def mutate(self, info, title):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("Authentication required")
        todo = Todo.objects.create(owner=user, title=title)
        return CreateTodo(todo=todo)

class ToggleTodo(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    todo = graphene.Field(TodoType)

    def mutate(self, info, id):
        user = info.context.user
        try:
            todo = Todo.objects.get(id=id)
        except Todo.DoesNotExist:
            raise Exception("Todo not found")
        if todo.owner != user and not user.is_superuser:
            raise Exception("Not permitted")
        todo.completed = not todo.completed
        todo.save()
        return ToggleTodo(todo=todo)

class Mutation(graphene.ObjectType):
    create_todo = CreateTodo.Field()
    toggle_todo = ToggleTodo.Field()
    update_todo = UpdateTodo.Field()
    delete_todo = DeleteTodo.Field()