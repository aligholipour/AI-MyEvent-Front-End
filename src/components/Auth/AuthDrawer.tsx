import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import StepOTP from "./StepOTP";
import Login from "./Login";
import { User } from "../../services/Auth/Auth";

function AuthDrawer({ isOpen, onClose, onLoginSuccess, onRegisterNeeded }: {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: () => void;
    onRegisterNeeded: (phone: string) => void;
}) {
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isExistUser, setIsExistUser] = useState(false);
    const [token, setToken] = useState<string | undefined>('');
    // const [user, setUser] = useState<User | null>(null);

    // Reset step when opening
    useEffect(() => {
        if (isOpen) {
            setStep('phone');
            setPhoneNumber('');
            setIsExistUser(false);
            // setUser(null);
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-[2px]"
                    />

                    {/* Slider Container */}
                    <motion.div
                        initial={{ y: "100%", x: "-50%" }}
                        animate={{ y: 0, x: "-50%" }}
                        exit={{ y: "100%", x: "-50%" }}
                        transition={{ type: "tween", duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                        className="fixed bottom-0 left-1/2 w-full max-w-[480px] bg-white z-[70] rounded-t-2xl shadow-2xl overflow-y-auto no-scrollbar pt-2"
                        dir="rtl"
                    >
                        <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto my-4" />

                        <div className="flex flex-col min-h-[45vh] px-6 pb-20">
                            {step === 'phone' ? (
                                <Login
                                    onClose={onClose}
                                    onContinue={(num, isNew, token) => {
                                        setPhoneNumber(num);
                                        setIsExistUser(isNew);
                                        setToken(token);
                                        setStep('otp');
                                    }}
                                />
                            ) : (
                                <StepOTP
                                    phoneNumber={phoneNumber}
                                    token={token}
                                    onBack={() => setStep('phone')}
                                    onSuccess={(loggedInUser) => {
                                        if (!isExistUser) {
                                            onRegisterNeeded(phoneNumber);
                                        } else if (loggedInUser) {
                                            onLoginSuccess();
                                        }
                                    }}
                                />
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default AuthDrawer;