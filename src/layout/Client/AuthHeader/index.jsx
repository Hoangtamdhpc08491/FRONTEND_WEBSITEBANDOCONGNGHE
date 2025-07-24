import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon } from '@heroicons/react/24/solid';

export default function AuthHeader() {
  const { pathname } = useLocation();

  const TITLES = {
    '/dang-nhap': 'Đăng nhập',
    '/dang-ky': 'Đăng ký',
    '/quen-mat-khau': 'Quên mật khẩu',
    '/dat-lai-mat-khau': 'Đặt lại mật khẩu',
    '/otp-verification': 'Xác thực OTP',
    '/forgot-password-notice': 'Xác thực email',
    '/register-email-sent': 'Kích hoạt tài khoản',
    '/verify-email': 'Xác nhận email'
  };
  const pageTitle = TITLES[pathname] ?? (pathname.startsWith('/verify-email') ? 'Xác nhận email' : '');

  const linkCls =
    'no-underline font-bold text-[var(--primary-color)] hover:text-[var(--secondary-color)] transition-colors duration-200 text-xs sm:text-sm whitespace-nowrap';

  return (
    <header className="bg-white w-screen shadow-md border-b-2 border-[var(--primary-color)]">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-center sm:justify-between">
        <div className="flex items-center min-w-0 hidden sm:flex">
          <Link to="/" className="no-underline flex-shrink-0">
            <img src="src/assets/Client/images/Logo/logo.svg" alt="Logo" className="h-18 sm:h-[50px] w-[160px]" />
          </Link>

          {pageTitle && (
            <>
              <span className="mx-2 sm:mx-3 text-neutral-400">|</span>
             <h2 className="text-base text-primary font-medium truncate">{pageTitle}</h2>

            </>
          )}
        </div>

        <div className="flex items-center sm:hidden">
          <Link to="/" className="no-underline">
            <img src="src/assets/Client/images/Logo/logo.svg" alt="Logo" className="h-18 sm:h-[50px] w-[160px] mx-auto" />
          </Link>
        </div>

        <Link to="/" className={`${linkCls} hidden sm:flex items-center gap-1`}>
          <HomeIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Về trang chủ</span>
        </Link>
      </div>
    </header>
  );
}
