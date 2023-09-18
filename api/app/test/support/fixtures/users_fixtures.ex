defmodule Rts.UsersFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `Rts.Users` context.
  """

  @doc """
  Generate a user.
  """
  def user_fixture(attrs \\ %{}) do
    {:ok, user} =
      attrs
      |> Enum.into(%{
        name: "some name",
        email: "some email"
      })
      |> Rts.Users.create_user()

    user
  end
end
