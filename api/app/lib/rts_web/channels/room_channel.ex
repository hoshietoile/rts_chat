defmodule RtsWeb.RoomChannel do
  use RtsWeb, :channel
  alias RtsWeb.Chat
  alias RtsWeb.UserStore
  alias RtsWeb.RoomJSON
  alias Rts.Rooms
  alias Rts.Rooms.Room

  @impl true
  def join("room:lobby", payload, socket) do
    if authorized?(payload) do
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  @impl true
  def join("room:" <> room_id, payload, socket) do
    IO.inspect payload
    if authorized?(payload) do
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # def handle_in("rooms_users", payload, socket) do
    # TODO: get user-list which belongs to the room
    # {room_id: user_id[]}
  # end

  def handle_in("list", payload, socket) do
    list = Chat.list(payload)
    {:reply, {:ok, %{list: list}}, socket}
  end

  def handle_in("new_msg", payload, socket) do
    Chat.add(payload)
    list = Chat.list(payload)
    broadcast!(socket, "new_msg", %{list: list})
    {:noreply, socket}
  end

  def handle_in("new_user", payload, socket) do
    id = UserStore.add(payload)
    {:reply, {:ok, %{id: id}}, socket}
  end

  def handle_in("on_user_inputing", payload, socket) do
    broadcast!(socket, "on_user_inputing", payload)
    {:reply, {:ok, %{}}, socket}
  end

  def handle_in("on_user_inputend", %{"user_id" => user_id} = payload, socket) do
    broadcast!(socket, "on_user_inputend", %{user_id: user_id})
    {:reply, {:ok, %{}}, socket}
  end

  def handle_in("new_room", payload, socket) do
    with {:ok, %Room{} = raw_room} <- Rooms.create_room(payload) do
      room = room_data(raw_room)
      broadcast!(socket, "on_new_room", %{data: room})
    end
    {:noreply, socket}
  end

  def room_data(room) do
    %{
      id: room.id,
      name: room.name
    }
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
