import React, { useState } from 'react';
import { usePWAInstall, useOnlineStatus } from '../hooks/usePWAInstall';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const isOnline = useOnlineStatus();
  const [dismissed, setDismissed] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  if (dismissed || isInstalled) return null;

  return (
    <>
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border-b border-cyan-800/40 px-4 py-2.5 text-xs text-slate-300 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="truncate">
            <strong className="text-cyan-300">갤럭시 Z 폴드7 PWA 최적화:</strong> HTTPS 사이트에서 홈 화면 앱으로 설치할 수 있습니다.
          </span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {isInstallable && (
            <button
              onClick={install}
              className="px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-[11px] shadow-sm transition"
            >
              앱 설치하기
            </button>
          )}

          <button
            onClick={() => setShowGuide(true)}
            className="px-2 py-1 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 text-[11px] transition"
          >
            설치 방법
          </button>

          <button
            onClick={() => setDismissed(true)}
            className="text-slate-400 hover:text-slate-200 text-xs px-1"
            title="닫기"
          >
            ✕
          </button>
        </div>
      </div>

      {!isOnline && (
        <div className="bg-amber-500/20 border-b border-amber-500/40 px-4 py-1.5 text-xs text-amber-300 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span>오프라인 상태입니다. 캐시된 레슨과 실습은 사용 가능하지만 실시간 AI 코치는 사용할 수 없습니다.</span>
        </div>
      )}

      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-200 shadow-2xl">
            <h4 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <span>갤럭시 Z 폴드7 및 모바일 기기 PWA 앱 설치 안내</span>
            </h4>
            <div className="space-y-3 text-xs text-slate-300 mt-3">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="font-semibold text-cyan-400 mb-1">안드로이드 / 삼성 인터넷 / 크롬:</div>
                <p>1. 브라우저 우측 상단 또는 하단 툴바의 메뉴(⋮)를 탭합니다.</p>
                <p>2. <strong>"홈 화면에 추가"</strong> 또는 <strong>"앱 설치"</strong>를 선택합니다.</p>
                <p>3. 설치를 확인하면 주소창 없는 독립형(Standalone) 앱으로 폴더블 듀얼 화면에 완벽 대응하여 실행됩니다.</p>
              </div>

              {isIOS && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <div className="font-semibold text-cyan-400 mb-1">iOS 사파리(Safari):</div>
                  <p>1. 사파리 하단 툴바의 공유(Share) 버튼을 탭합니다.</p>
                  <p>2. <strong>"홈 화면에 추가"</strong>를 선택합니다.</p>
                </div>
              )}

              <p className="text-[11px] text-slate-400 italic">
                * 안내: AI Studio 개발 미리보기 환경에서는 iframe 보안 정책에 따라 상단 공유 URL을 브라우저 탭에서 직접 열어야 네이티브 설치 배너가 팝업될 수 있습니다.
              </p>
            </div>
            <button
              onClick={() => setShowGuide(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
};
