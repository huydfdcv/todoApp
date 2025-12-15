import graphene
from accounts.schema import Query as AccountsQuery, Mutation as AccountsMutation
from todos.schema import Query as TodosQuery, Mutation as TodosMutation

class Query(AccountsQuery, TodosQuery, graphene.ObjectType):
    pass

class Mutation(AccountsMutation, TodosMutation, graphene.ObjectType):
    pass

schema = graphene.Schema(query=Query, mutation=Mutation)