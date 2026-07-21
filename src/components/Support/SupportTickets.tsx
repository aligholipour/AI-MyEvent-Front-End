import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as LucideIcons from 'lucide-react';

export interface TicketMessage {
  id: string;
  sender: 'user' | 'support';
  message: string;
  date: string;
}

export interface SupportTicket {
  id: string;
  title: string;
  category: string;
  status: 'answered' | 'unanswered';
  date: string;
  messages: TicketMessage[];
}

interface SupportTicketsProps {
  onBack: () => void;
}

const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 't-1',
    title: 'عدم دریافت پیامک تایید هویت',
    category: 'فنی',
    status: 'answered',
    date: '۱۴۰۳/۰۳/۱۵',
    messages: [
      {
        id: 'm1',
        sender: 'user',
        message: 'سلام. من برای ثبت‌نام اقدام کردم ولی پیامک کد تایید برای خط همراه اول من ارسال نشد. چند بار هم تلاش کردم.',
        date: '۱۴۰۳/۰۳/۱۵ - ۱۰:۱۵'
      },
      {
        id: 'm2',
        sender: 'support',
        message: 'سلام کاربر گرامی. با عرض پوزش از مشکل پیش‌آمده، در ساعت مذکور اختلال در درگاه پیامکی همراه اول وجود داشت که برطرف شد. لطفا مجددا تلاش کنید.',
        date: '۱۴۰۳/۰۳/۱۵ - ۱۱:۳۰'
      }
    ]
  },
  {
    id: 't-2',
    title: 'درخواست فاکتور برای رویداد پرداخت شده',
    category: 'مالی',
    status: 'unanswered',
    date: '۱۴۰۳/۰۴/۰۲',
    messages: [
      {
        id: 'm3',
        sender: 'user',
        message: 'ببخشید من برای کارگاه طراحی تجربه کاربری بلیت تهیه کردم و نیاز به فاکتور رسمی دارم. چطور می‌تونم دریافتش کنم؟',
        date: '۱۴۰۳/۰۴/۰۲ - ۱۴:۴۰'
      }
    ]
  }
];

export function SupportTickets({ onBack }: SupportTicketsProps) {
  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('support_tickets');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_TICKETS;
      }
    }
    return INITIAL_TICKETS;
  });

  const [view, setView] = useState<'list' | 'create' | 'details'>('list');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  // New ticket form states
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('فنی');
  const [newMessage, setNewMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reply state
  const [replyMessage, setReplyMessage] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  const saveTickets = (updatedTickets: SupportTicket[]) => {
    setTickets(updatedTickets);
    localStorage.setItem('support_tickets', JSON.stringify(updatedTickets));
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setFormError('لطفا موضوع تیکت را وارد کنید');
      return;
    }
    if (!newMessage.trim()) {
      setFormError('لطفا متن پیام خود را وارد کنید');
      return;
    }

    setFormError('');
    setIsSubmitting(true);

    setTimeout(() => {
      const newTicket: SupportTicket = {
        id: `t-${Date.now()}`,
        title: newTitle.trim(),
        category: newCategory,
        status: 'unanswered',
        date: new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()),
        messages: [
          {
            id: `m-${Date.now()}`,
            sender: 'user',
            message: newMessage.trim(),
            date: new Intl.DateTimeFormat('fa-IR', { 
              year: 'numeric', 
              month: '2-digit', 
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            }).format(new Date())
          }
        ]
      };

      const updated = [newTicket, ...tickets];
      saveTickets(updated);

      setNewTitle('');
      setNewCategory('فنی');
      setNewMessage('');
      setIsSubmitting(false);
      setView('list');
    }, 1000);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;

    setIsReplying(true);

    setTimeout(() => {
      const newMessageObj: TicketMessage = {
        id: `m-${Date.now()}`,
        sender: 'user',
        message: replyMessage.trim(),
        date: new Intl.DateTimeFormat('fa-IR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }).format(new Date())
      };

      const updatedMessages = [...selectedTicket.messages, newMessageObj];
      const updatedTicket: SupportTicket = {
        ...selectedTicket,
        status: 'unanswered', // Mark unanswered so the support team can reply
        messages: updatedMessages
      };

      const updatedTickets = tickets.map(t => t.id === selectedTicket.id ? updatedTicket : t);
      saveTickets(updatedTickets);
      setSelectedTicket(updatedTicket);
      setReplyMessage('');
      setIsReplying(false);
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.35, ease: [0.32, 0.94, 0.6, 1] }}
      className="flex-1 flex flex-col w-full overflow-hidden bg-[#F8F9FC]"
      dir="rtl"
    >
      {/* Dynamic Header - More Tighter and Tidy */}
      <header className="px-5 pt-8 pb-3.5 bg-white border-b border-gray-100 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-red-50 text-[#ED1C24] rounded-xl flex items-center justify-center">
            <LucideIcons.Headphones className="w-4 h-4" />
          </div>
          <div className="flex flex-col items-start text-right">
            <h1 className="text-xs font-black text-gray-900 leading-none">
              {view === 'list' && 'تیکت‌های پشتیبانی'}
              {view === 'create' && 'ثبت تیکت جدید'}
              {view === 'details' && 'مشاهده تیکت'}
            </h1>
            <p className="text-[9px] font-bold text-gray-400 mt-0.5">
              {view === 'list' && 'لیست تیکت‌های شما و وضعیت پاسخ‌دهی'}
              {view === 'create' && 'ارسال درخواست جدید به پشتیبانی همایش'}
              {view === 'details' && selectedTicket?.title}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (view === 'create') setView('list');
            else if (view === 'details') setView('list');
            else onBack();
          }}
          className="p-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-100 shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          <LucideIcons.ArrowRight className="w-4 h-4 text-gray-700" />
        </button>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5">
        <AnimatePresence mode="wait">
          {view === 'list' && (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {/* Header Action to Submit Ticket - Redesigned h-11, compact and minimalist */}
              <button
                onClick={() => setView('create')}
                className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-black text-[11px] rounded-xl flex items-center justify-center gap-2 transition-all active:scale-98 shadow-sm cursor-pointer"
              >
                <LucideIcons.Plus className="w-4.5 h-4.5" />
                ثبت تیکت جدید
              </button>

              {/* Tickets List - More compact cards */}
              <div className="space-y-2.5 pt-1">
                {tickets.length > 0 ? (
                  tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      onClick={() => {
                        setSelectedTicket(ticket);
                        setView('details');
                      }}
                      className="bg-white border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-all active:scale-[0.99] shadow-xs cursor-pointer text-right flex flex-col gap-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100/80">
                          {ticket.category}
                        </span>
                        <span className="text-[9px] font-bold text-gray-400">
                          {ticket.date}
                        </span>
                      </div>

                      <h3 className="text-xs font-black text-gray-800 leading-snug">
                        {ticket.title}
                      </h3>

                      <div className="border-t border-gray-50 pt-2 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[10px] text-gray-450 font-bold">
                          <LucideIcons.MessageSquare className="w-3.5 h-3.5" />
                          <span>{ticket.messages.length} پیام</span>
                        </div>

                        {ticket.status === 'answered' ? (
                          <div className="flex items-center gap-0.5 text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full text-[9px] font-black">
                            <LucideIcons.Check className="w-2.5 h-2.5 stroke-[3px]" />
                            پاسخ داده شده
                          </div>
                        ) : (
                          <div className="flex items-center gap-0.5 text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-full text-[9px] font-black">
                            <LucideIcons.Clock className="w-2.5 h-2.5" />
                            در انتظار پاسخ
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-16 text-center flex flex-col items-center justify-center gap-2.5">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100/50 flex items-center justify-center text-gray-400">
                      <LucideIcons.Inbox className="w-5 h-5" />
                    </div>
                    <p className="text-gray-500 font-black text-[11px]">هنوز تیکتی ثبت نکرده‌اید</p>
                    <p className="text-gray-400 font-bold text-[9px]">تیکت‌های شما پس از ثبت در این قسمت نمایش داده می‌شوند.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {view === 'create' && (
            <motion.form
              key="create"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleCreateTicket}
              className="space-y-4 bg-white border border-gray-100 rounded-2xl p-5 text-right shadow-xs"
            >
              {formError && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-[10px] font-black rounded-xl flex items-center gap-1.5">
                  <LucideIcons.AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Title Input - Tight h-10 */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-450 mr-0.5">موضوع تیکت</label>
                <input
                  type="text"
                  placeholder="مثال: مشکل در پرداخت بلیت"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 h-10 px-3 rounded-xl text-[11px] font-bold focus:bg-white outline-none focus:ring-2 focus:ring-slate-100 transition-all text-right"
                />
              </div>

              {/* Category buttons - Tight h-9 */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-450 mr-0.5">دسته‌بندی موضوعی</label>
                <div className="grid grid-cols-3 gap-2">
                  {['فنی', 'مالی', 'سایر'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewCategory(cat)}
                      className={`h-9 rounded-lg text-[10px] font-black border transition-all cursor-pointer ${
                        newCategory === cat
                          ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                          : 'bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100/50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Box - Compact rows={4} */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-450 mr-0.5">متن پیام پشتیبانی</label>
                <textarea
                  placeholder="شرح کامل مشکل خود را بنویسید..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={4}
                  className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl text-[11px] font-bold focus:bg-white outline-none focus:ring-2 focus:ring-slate-100 transition-all text-right resize-none leading-relaxed"
                />
              </div>

              {/* Action Buttons - Tight h-10 */}
              <div className="flex gap-2.5 pt-1.5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-10 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-black text-[11px] rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-98 shadow-sm cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <LucideIcons.Send className="w-3.5 h-3.5 rotate-180" />
                      ارسال تیکت
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setView('list')}
                  className="h-10 px-5 bg-gray-50 hover:bg-gray-100 text-gray-600 font-black text-[11px] rounded-xl transition-all active:scale-98 border border-gray-100 cursor-pointer"
                >
                  انصراف
                </button>
              </div>
            </motion.form>
          )}

          {view === 'details' && selectedTicket && (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3.5"
            >
              {/* Ticket Information Card - More Tighter and Elegant */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4 text-right space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100/80">
                    {selectedTicket.category}
                  </span>
                  {selectedTicket.status === 'answered' ? (
                    <div className="flex items-center gap-0.5 text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full text-[9px] font-black">
                      <LucideIcons.Check className="w-2.5 h-2.5 stroke-[3px]" />
                      پاسخ داده شده
                    </div>
                  ) : (
                    <div className="flex items-center gap-0.5 text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-full text-[9px] font-black">
                      <LucideIcons.Clock className="w-2.5 h-2.5" />
                      در حال بررسی
                    </div>
                  )}
                </div>

                <h2 className="text-xs font-black text-gray-850 leading-relaxed">
                  {selectedTicket.title}
                </h2>
                <div className="text-[9px] font-bold text-gray-400 flex items-center gap-1 pt-0.5">
                  <span>شناسه تیکت:</span>
                  <span className="font-mono">{selectedTicket.id}</span>
                </div>
              </div>

              {/* Chat messages */}
              <div className="space-y-3 pt-1">
                {selectedTicket.messages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[85%] ${
                        isUser ? 'mr-auto items-end' : 'ml-auto items-start'
                      }`}
                    >
                      <div
                        className={`p-3 rounded-xl text-[11px] font-bold leading-relaxed text-right shadow-xs ${
                          isUser
                            ? 'bg-slate-900 text-white rounded-tr-none'
                            : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
                        }`}
                      >
                        {msg.message}
                      </div>
                      <span className="text-[8px] font-bold text-gray-400 mt-1 px-1">
                        {msg.date}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Reply Send Box (NEW COMPACT REPLY BOX) */}
              <form onSubmit={handleSendReply} className="bg-white border border-gray-100 rounded-xl p-2.5 flex gap-2 items-end shadow-xs mt-2">
                <textarea
                  placeholder="پاسخ خود را اینجا بنویسید..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={2}
                  className="flex-1 bg-gray-50 border border-gray-100 p-2 rounded-lg text-[11px] font-bold focus:bg-white outline-none focus:ring-2 focus:ring-slate-100 transition-all text-right resize-none leading-relaxed"
                />
                <button
                  type="submit"
                  disabled={isReplying || !replyMessage.trim()}
                  className="h-8 w-8 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-lg flex items-center justify-center shrink-0 transition-all active:scale-95 cursor-pointer"
                >
                  {isReplying ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <LucideIcons.Send className="w-3.5 h-3.5 rotate-180" />
                  )}
                </button>
              </form>

              {/* Action reply note for unanswered */}
              {selectedTicket.status === 'unanswered' && (
                <div className="p-3 bg-amber-50/50 border border-amber-100/40 text-amber-700 text-[9px] font-bold rounded-xl flex items-center gap-1.5 leading-relaxed text-right mt-1">
                  <LucideIcons.Info className="w-4 h-4 shrink-0" />
                  <span>پشتیبانان ما در حال بررسی پیام جدید شما هستند و به‌زودی پاسخ تکمیلی را ارسال خواهند کرد.</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
