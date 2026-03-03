import { useState, useCallback } from 'react';

type Operation = '+' | '-' | '×' | '÷' | null;

function App() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<Operation>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const inputDigit = useCallback((digit: string) => {
    if (waitingForNewValue) {
      setDisplay(digit);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  }, [display, waitingForNewValue]);

  const inputDecimal = useCallback(() => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  }, [display, waitingForNewValue]);

  const clear = useCallback(() => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  }, []);

  const toggleSign = useCallback(() => {
    const value = parseFloat(display);
    setDisplay(String(value * -1));
  }, [display]);

  const inputPercent = useCallback(() => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  }, [display]);

  const performOperation = useCallback((nextOperation: Operation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue;
      let newValue: number;

      switch (operation) {
        case '+':
          newValue = currentValue + inputValue;
          break;
        case '-':
          newValue = currentValue - inputValue;
          break;
        case '×':
          newValue = currentValue * inputValue;
          break;
        case '÷':
          newValue = currentValue / inputValue;
          break;
        default:
          newValue = inputValue;
      }

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForNewValue(true);
    setOperation(nextOperation);
  }, [display, previousValue, operation]);

  const calculate = useCallback(() => {
    if (operation === null || previousValue === null) return;

    const inputValue = parseFloat(display);
    let newValue: number;

    switch (operation) {
      case '+':
        newValue = previousValue + inputValue;
        break;
      case '-':
        newValue = previousValue - inputValue;
        break;
      case '×':
        newValue = previousValue * inputValue;
        break;
      case '÷':
        newValue = previousValue / inputValue;
        break;
      default:
        return;
    }

    setDisplay(String(newValue));
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(true);
  }, [display, operation, previousValue]);

  const formatDisplay = (value: string): string => {
    const num = parseFloat(value);
    if (isNaN(num)) return '0';
    if (value.includes('.') && value.endsWith('.')) return value;
    if (value.includes('.')) {
      const parts = value.split('.');
      if (parts[1].length > 8) {
        return num.toFixed(8);
      }
      return value;
    }
    if (Math.abs(num) >= 1e9) {
      return num.toExponential(4);
    }
    return num.toLocaleString('en-US', { maximumFractionDigits: 8 });
  };

  const CalcButton = ({
    children,
    onClick,
    variant = 'number',
    isActive = false
  }: {
    children: React.ReactNode;
    onClick: () => void;
    variant?: 'number' | 'operation' | 'function';
    isActive?: boolean;
  }) => {
    const baseClasses = "w-full aspect-square rounded-2xl font-medium text-xl md:text-2xl transition-all duration-200 active:scale-95 flex items-center justify-center min-h-[56px] md:min-h-[64px]";

    const variantClasses = {
      number: "bg-white/60 backdrop-blur-sm text-stone-700 hover:bg-white/80 shadow-lg shadow-stone-200/50",
      operation: isActive
        ? "bg-rose-300 text-white shadow-lg shadow-rose-300/50"
        : "bg-rose-200/80 backdrop-blur-sm text-rose-800 hover:bg-rose-300/80 shadow-lg shadow-rose-200/50",
      function: "bg-stone-200/60 backdrop-blur-sm text-stone-600 hover:bg-stone-300/60 shadow-lg shadow-stone-200/50"
    };

    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${variantClasses[variant]}`}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50 flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-rose-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl" />
      </div>

      {/* Main calculator container */}
      <div className="relative z-10 w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="font-serif text-3xl md:text-4xl text-stone-700 tracking-tight">
            me
            <span className="text-rose-400">.</span>
            calculator
          </h1>
          <p className="text-stone-400 text-sm mt-2 font-mono">calculate your worth</p>
        </div>

        {/* Calculator body */}
        <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-4 md:p-6 shadow-2xl shadow-stone-300/30 border border-white/60">
          {/* Display */}
          <div className="bg-gradient-to-br from-stone-800 to-stone-900 rounded-2xl p-4 md:p-6 mb-4 md:mb-6 shadow-inner relative overflow-hidden">
            {/* Subtle grid pattern */}
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            />

            {/* Operation indicator */}
            <div className="flex justify-between items-center mb-2 min-h-[24px]">
              <span className="text-stone-500 text-xs font-mono">
                {previousValue !== null && operation && `${previousValue} ${operation}`}
              </span>
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-rose-400' : i === 1 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                  />
                ))}
              </div>
            </div>

            {/* Main display */}
            <div className="text-right">
              <span
                className="text-4xl md:text-5xl font-mono text-white tracking-wider"
                style={{ textShadow: '0 0 30px rgba(251, 207, 232, 0.3)' }}
              >
                {formatDisplay(display)}
              </span>
            </div>
          </div>

          {/* Button grid */}
          <div className="grid grid-cols-4 gap-2 md:gap-3">
            {/* Row 1 */}
            <CalcButton onClick={clear} variant="function">AC</CalcButton>
            <CalcButton onClick={toggleSign} variant="function">+/-</CalcButton>
            <CalcButton onClick={inputPercent} variant="function">%</CalcButton>
            <CalcButton onClick={() => performOperation('÷')} variant="operation" isActive={operation === '÷'}>÷</CalcButton>

            {/* Row 2 */}
            <CalcButton onClick={() => inputDigit('7')}>7</CalcButton>
            <CalcButton onClick={() => inputDigit('8')}>8</CalcButton>
            <CalcButton onClick={() => inputDigit('9')}>9</CalcButton>
            <CalcButton onClick={() => performOperation('×')} variant="operation" isActive={operation === '×'}>×</CalcButton>

            {/* Row 3 */}
            <CalcButton onClick={() => inputDigit('4')}>4</CalcButton>
            <CalcButton onClick={() => inputDigit('5')}>5</CalcButton>
            <CalcButton onClick={() => inputDigit('6')}>6</CalcButton>
            <CalcButton onClick={() => performOperation('-')} variant="operation" isActive={operation === '-'}>−</CalcButton>

            {/* Row 4 */}
            <CalcButton onClick={() => inputDigit('1')}>1</CalcButton>
            <CalcButton onClick={() => inputDigit('2')}>2</CalcButton>
            <CalcButton onClick={() => inputDigit('3')}>3</CalcButton>
            <CalcButton onClick={() => performOperation('+')} variant="operation" isActive={operation === '+'}>+</CalcButton>

            {/* Row 5 */}
            <div className="col-span-2">
              <button
                onClick={() => inputDigit('0')}
                className="w-full h-full min-h-[56px] md:min-h-[64px] rounded-2xl bg-white/60 backdrop-blur-sm text-stone-700 hover:bg-white/80 shadow-lg shadow-stone-200/50 font-medium text-xl md:text-2xl transition-all duration-200 active:scale-95"
              >
                0
              </button>
            </div>
            <CalcButton onClick={inputDecimal}>.</CalcButton>
            <button
              onClick={calculate}
              className="w-full aspect-square rounded-2xl bg-gradient-to-br from-rose-400 to-rose-500 text-white font-medium text-2xl md:text-3xl shadow-lg shadow-rose-300/50 transition-all duration-200 active:scale-95 hover:from-rose-500 hover:to-rose-600 flex items-center justify-center min-h-[56px] md:min-h-[64px]"
            >
              =
            </button>
          </div>
        </div>

        {/* Decorative element */}
        <div className="flex justify-center mt-6 gap-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-stone-300/60"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-stone-400/60 text-xs font-mono tracking-wide">
          Requested by <span className="text-stone-500/70">@BASECRUDE</span> · Built by <span className="text-stone-500/70">@clonkbot</span>
        </p>
      </footer>
    </div>
  );
}

export default App;
