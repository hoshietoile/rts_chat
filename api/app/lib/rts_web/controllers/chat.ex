defmodule RtsWeb.Chat do
  @key "chat"

  def conn() do
    # TODO: Have to configure as different host when deploy
    {:ok, conn} = Redix.start_link(host: "store", port: 6379)
    conn
  end

  def add(payload) do
    conn = conn()
    {:ok, result} = Jason.encode(payload)
    {:ok, res} = Redix.command(conn, ["XADD", @key, "*", "data", result])
  end

  def list(payload \\ %{"room_id" => nil}) do
    conn = conn()
    {:ok, res} = Redix.command(conn, ["XRANGE", @key, "-", "+"])
    {:ok, room_id} = Map.fetch(payload, "room_id")

    res
    |> Enum.map(fn [id, [_key, data]] ->
      {:ok, result} = Jason.decode(data)
      result |> Map.put("id", id)
    end)
    |> Enum.filter(fn %{"room_id" => rid} -> room_id == rid end)
  end
end
