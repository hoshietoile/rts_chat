defmodule RtsWeb.UserStore do
  @key "user"
  @user_room_key "user_room"


  def conn() do
    {:ok, conn} = Redix.start_link(host: "store", port: 6379)
    conn
  end

  def add(%{"name" => user_name} = payload) do
    conn = conn()
    {:ok, result} = Jason.encode(payload)
    {:ok, res} = Redix.command(conn, ["XADD", @key, "*", "data", result])
    res
  end

  def join_room(%{room_id: room_id, user_id: user_id, user_name: user_name} = payload) do
    conn = conn()
    if room_id != nil do
      {rmid, _} = Integer.parse(room_id)
      {:ok, result} = Jason.encode([room_id, user_id, user_name])
      {:ok, res} = Redix.command(conn, ["SADD", @user_room_key <> ":" <> room_id, result])
    end
  end

  def get_room_member_list(room_id) do
    conn = conn()
    {:ok, result} = Redix.command(conn, ["SMEMBERS", @user_room_key <> ":" <> Integer.to_string(room_id)])
    result |> Enum.map(fn encoded ->
      {:ok, [room_id, user_id, user_name]} = Jason.decode(encoded)
      %{room_id: room_id, user_id: user_id, user_name: user_name}
    end)
  end

  def delete_room_member(%{"room_id" => room_id, "user_name" => user_name, "user_id" => user_id} = payload) do
    conn = conn()
    {:ok, result} = Jason.encode([Integer.to_string(room_id), user_id, user_name])
    IO.inspect result
    {:ok, r} = Redix.command(conn, ["SREM", @user_room_key <> ":" <> Integer.to_string(room_id), result])
    get_room_member_list(room_id)
  end
end
