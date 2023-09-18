defmodule Rts.Users.User do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field :name, :string
    field :email, :string

    many_to_many :rooms,
                  Rts.Rooms.Room,
                  join_through: "users_rooms",
                  on_replace: :delete,
                  on_delete: :delete_all
    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:name, :email])
    |> validate_required([:name, :email])
  end
end
