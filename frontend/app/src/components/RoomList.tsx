import { Room } from '../api/rest/rooms';
import { NAV_WIDTH } from '../constant';
import Dropdown from './Dropdown';

type Props = {
  rooms: Room[];
  onClickRow: (rowId: string) => void;
};

const RoomList = ({ rooms, onClickRow }: Props) => {
  return (
    <div
      className={`overflow-y-scroll hidden-scrollbar border-r w-[${NAV_WIDTH}px]`}
    >
      <div>
        <ul>
          {rooms.map((room) => {
            return (
              <li
                key={room.id}
                className="border-b border-1 px-4 py-2 hover:bg-slate-200 dark:hover:bg-teal-900 cursor-pointer"
              >
                <div onClick={() => onClickRow(room.id)}>
                  <div className="flex">
                    <span className="font-bold flex-1">{room.name}</span>
                    <span>
                      <Dropdown />
                    </span>
                  </div>

                  <ul className="flex space-x-2 truncate text-ellipsis">
                    {/* TODO: Show userlist */}
                    <li>user1</li>
                    {/* <li>user2</li>
                      <li>user3</li>
                      <li>user4</li>
                      <li>user5</li>
                      <li>user6</li>
                      <li>user7</li>
                      <li>user8</li>
                      <li>user9</li>
                      <li>user10</li> */}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default RoomList;
