import { motion } from "motion/react";

function UserCard({ consultant }: { consultant: any; key?: React.Key }) {
  return (
    <motion.div
      className="flex-shrink-0 min-w-[140px] bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
      whileTap={{ scale: 0.98 }}
    >
      <div className="space-y-4">
        {/* Top Badge */}
        {/* <div className="flex justify-end">
          <div className="bg-orange-50 text-orange-600 text-[9px] font-black px-2 py-0.5 rounded-full border border-orange-100">
            {consultant.badge}
          </div>
        </div> */}

        {/* Profile Image & Rating */}
        <div className="relative flex justify-center">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-lg">
            <img
              src={process.env.File_BaseURL + consultant.image}
              alt={consultant.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          {/* <div className="absolute -bottom-1 bg-yellow-400 text-white px-2 py-0.5 rounded-full text-[8px] font-black flex items-center gap-0.5 shadow-sm border border-white">
            <span>{consultant.rating}</span>
            <span className="text-[10px]">★</span>
          </div> */}
        </div>

        {/* Info */}
        <div className="text-center space-y-0.5">
          <h3 className="text-gray-900 font-black text-sm leading-none">{consultant.name}</h3>
          <p className="text-gray-400 text-[10px] font-bold">{consultant.jobTitle}</p>
        </div>
      </div>

      {/* Button */}
      {/* <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        className="w-full bg-gray-100 text-gray-600 py-2.5 rounded-xl text-[10px] font-black hover:bg-gray-200 transition-colors">
        مشاهده پروفایل
      </motion.button> */}
    </motion.div>
  );
}

export default UserCard;