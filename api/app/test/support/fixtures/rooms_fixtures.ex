defmodule Rts.RoomsFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `Rts.Rooms` context.
  """

  @doc """
  Generate a room.
  """
  def room_fixture(attrs \\ %{}) do
    {:ok, room} =
      attrs
      |> Enum.into(%{
        name: "some name"
      })
      |> Rts.Rooms.create_room()

    room
  end
end
