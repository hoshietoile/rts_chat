defmodule RtsWeb.RoomControllerTest do
  use RtsWeb.ConnCase

  import Rts.RoomsFixtures

  alias Rts.Rooms.Room

  @create_attrs %{
    name: "some name"
  }
  @update_attrs %{
    name: "some updated name"
  }
  @invalid_attrs %{name: nil}

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all rooms", %{conn: conn} do
      conn = get(conn, ~p"/api/rooms")
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create room" do
    test "renders room when data is valid", %{conn: conn} do
      conn = post(conn, ~p"/api/rooms", room: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, ~p"/api/rooms/#{id}")

      assert %{
               "id" => ^id,
               "name" => "some name"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, ~p"/api/rooms", room: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update room" do
    setup [:create_room]

    test "renders room when data is valid", %{conn: conn, room: %Room{id: id} = room} do
      conn = put(conn, ~p"/api/rooms/#{room}", room: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, ~p"/api/rooms/#{id}")

      assert %{
               "id" => ^id,
               "name" => "some updated name"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, room: room} do
      conn = put(conn, ~p"/api/rooms/#{room}", room: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete room" do
    setup [:create_room]

    test "deletes chosen room", %{conn: conn, room: room} do
      conn = delete(conn, ~p"/api/rooms/#{room}")
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, ~p"/api/rooms/#{room}")
      end
    end
  end

  defp create_room(_) do
    room = room_fixture()
    %{room: room}
  end
end
