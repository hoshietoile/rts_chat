defmodule RtsWeb.RoomChannel do
  use RtsWeb, :channel
  alias RtsWeb.Chat

  @impl true
  def join("room:lobby", payload, socket) do
    if authorized?(payload) do
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_in("new_msg", payload, socket) do
    IO.inspect payload
    Chat.add(payload)
    list = Chat.list
    IO.inspect list
    broadcast!(socket, "new_msg", %{list: list})
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
