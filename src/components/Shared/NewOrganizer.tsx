import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { AppUsers } from "../../types";
import { getUsers } from "../../services/users";
import { ChevronLeft } from "lucide-react";
import UserCard from "./UserCard";

function NewOrganizer({ isLoading }: { isLoading?: boolean }) {
  const [userList, setUsers] = useState<AppUsers[]>([])

  const hasFetched = useRef(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const [dragLimit, setDragLimit] = useState(0);

  useEffect(() => {
    const calculateDragLimit = () => {
      if (!containerRef.current || !sliderRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const contentWidth = sliderRef.current.scrollWidth;

      const maxDrag = Math.max(0, contentWidth - containerWidth);

      setDragLimit(maxDrag);
    };

    calculateDragLimit();

    window.addEventListener("resize", calculateDragLimit);

    return () => {
      window.removeEventListener("resize", calculateDragLimit);
    };
  }, [userList]);

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

      <div
        ref={containerRef}
        className="relative overflow-hidden"
      >
        <motion.div
          ref={sliderRef}
          className="flex gap-4 px-6 cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{
            left: 0,
            right: dragLimit
          }}
          dragElastic={0.05}
          whileTap={{ cursor: "grabbing" }}
        >
          {userList.map((consultant) => (
            <UserCard
              key={consultant.id}
              consultant={consultant}
            />
          ))}
        </motion.div>
      </div>


      {/* <div className="relative">
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
            whileTap={{ cursor: 'grabbing' }}>
            {userList?.map((consultant) => (
              <UserCard key={consultant.id} consultant={consultant} />
            ))}
          </motion.div>
        )}
      </div> */}
    </section>
  );
}

export default NewOrganizer;