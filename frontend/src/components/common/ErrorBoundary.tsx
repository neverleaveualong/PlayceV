import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    if (this.props.fallback) return this.props.fallback;

    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 px-8">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
          <FiAlertTriangle className="text-red-500 text-2xl" />
        </div>
        <div className="text-center">
          <p className="text-gray-800 font-semibold text-base mb-1">
            문제가 발생했습니다
          </p>
          <p className="text-gray-400 text-sm">
            잠시 후 다시 시도해주세요
          </p>
        </div>
        <button
          onClick={this.handleReset}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-primary5 bg-primary4/30 rounded-xl hover:bg-primary4/50 transition-colors"
        >
          <FiRefreshCw className="text-sm" />
          다시 시도
        </button>
      </div>
    );
  }
}
