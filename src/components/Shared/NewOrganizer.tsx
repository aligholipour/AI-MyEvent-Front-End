import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { AppUsers } from "../../types";
import { getUsers } from "../../services/users";
import { ChevronLeft } from "lucide-react";
import UserCard from "./UserCard";

function NewOrganizer({ isLoading }: { isLoading?: boolean }) {
  const [userList, setUsers] = useState<AppUsers[]>([])

  const hasFetched = useRef(false);

  useEffect(() => {

    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchUsers = async () => {
      try {
        const eventData = await getUsers({ pageNumber: 1, pageSize: 10 });
        setUsers(eventData.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <section className="py-8 bg-gray-50/30 overflow-hidden" dir="rtl">
      <div className="px-6 flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-gray-900">برگزارکنندگان جدید</h2>
        <button className="text-[#ED1C24] font-black text-xs">مشاهده همه</button>
      </div>

      <div className="relative">
        {isLoading ? (
          <div className="flex gap-4 px-6">
            <div className="w-[210px] h-[240px] bg-gray-100 rounded-2xl animate-pulse" />
            <div className="w-[210px] h-[240px] bg-gray-100 rounded-2xl animate-pulse" />
          </div>
        ) : (
          <motion.div
            className="flex gap-4 px-6 cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 650 }}
            dragElastic={0.1}
            whileTap={{ cursor: 'grabbing' }}
          >
            {userList?.map((consultant) => (
              <UserCard key={consultant.id} consultant={consultant} />
            ))}

            <motion.div
              className="flex-shrink-0 w-[210px] h-[200px] bg-white rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-[#a5a5a5] transition-colors"
              whileTap={{ scale: 0.98 }}>
              <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 shadow-sm">
                <ChevronLeft className="w-7 h-7 text-gray-400" />
              </div>
              <div className="text-center">
                <span className="text-gray-900 font-black text-base block">مشاهده همه</span>
                <span className="text-gray-400 text-[10px] font-bold">بیش از ۵۰ مشاور برتر</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default NewOrganizer;