"use client";
import React from 'react';
import { LoginFormData } from '@/types/dashboard';

interface LoginFormProps {
    loginForm: LoginFormData;
    setLoginForm: React.Dispatch<React.SetStateAction<LoginFormData>>;
    loginError: string;
    onLogin: () => void;
    loading?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
    loginForm,
    setLoginForm,
    loginError,
    onLogin,
    loading = false
}) => {
    const handleInputChange = (field: keyof LoginFormData, value: string): void => {
        setLoginForm((prev: LoginFormData) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter' && !loading) {
            onLogin();
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="bg-white border-2 border-black p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-black">HOWDOYOUDO</h1>
                        <p className="text-gray-600 mt-2">대시보드 로그인</p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-black mb-2">
                                아이디
                            </label>
                            <input
                                type="text"
                                value={loginForm.username}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    handleInputChange('username', e.target.value)
                                }
                                className="w-full px-3 py-2 border-2 border-gray-300 bg-white text-black focus:border-black focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                onKeyPress={handleKeyPress}
                                placeholder="아이디를 입력하세요"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-black mb-2">
                                비밀번호
                            </label>
                            <input
                                type="password"
                                value={loginForm.password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    handleInputChange('password', e.target.value)
                                }
                                className="w-full px-3 py-2 border-2 border-gray-300 bg-white text-black focus:border-black focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                onKeyPress={handleKeyPress}
                                placeholder="비밀번호를 입력하세요"
                                disabled={loading}
                            />
                        </div>

                        {loginError && (
                            <div className="bg-red-50 border-2 border-red-200 p-3">
                                <p className="text-red-800 text-sm">{loginError}</p>
                            </div>
                        )}

                        <button
                            onClick={onLogin}
                            disabled={loading || !loginForm.username.trim() || !loginForm.password.trim()}
                            className="w-full bg-black text-white py-2 px-4 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>로그인 중...</span>
                                </>
                            ) : (
                                <span>로그인</span>
                            )}
                        </button>
                    </div>

                    <div className="mt-4 text-center text-sm text-gray-600">
                        <p>테스트 계정: admin / admin123</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;