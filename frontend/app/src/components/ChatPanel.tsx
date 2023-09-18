import { UserIcon } from '@heroicons/react/20/solid';
import { useMemo } from 'react';

type Props = {
  userName: string;
  email: string;
  createdAt: string;
  content: string;
};

const ChatPanel = ({ userName, email, createdAt, content }: Props) => {
  const displayDate = useMemo<string>(() => {
    return new Date(parseInt(createdAt, 10)).toLocaleString();
  }, [createdAt]);

  return (
    <li className="px-2 py-1 border-b">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0 border rounded-full">
          <UserIcon className="w-6 h-6" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate dark:text-white flex">
            <span className="flex-1">{userName}</span>
            <span className="">{displayDate}</span>
          </div>
          <p className="text-sm text-gray-500 truncate dark:text-gray-400">
            {email}
          </p>
        </div>
      </div>

      <span className="flex-1">{content}</span>
    </li>
  );
};

export default ChatPanel;
