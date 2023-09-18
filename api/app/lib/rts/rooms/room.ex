defmodule Rts.Rooms.Room do
  use Ecto.Schema
  import Ecto.Changeset

  schema "rooms" do
    field :name, :string


    many_to_many :users,
                  Rts.Users.User,
                  join_through: "users_rooms",
                  on_replace: :delete,
                  on_delete: :delete_all

    timestamps()
  end

  @doc false
  def changeset(room, attrs) do
    room
    |> cast(attrs, [:name])
    |> validate_required([:name])
  end
end
