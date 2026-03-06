
import React, { useState, useEffect, useRef } from 'react';
import { 
  Package, MapPin, Send, MessageSquare, Plus, User, 
  Bell, ClipboardList, Activity, 
  Home, X, Wrench, ChevronRight,
  BarChart3, Zap, DollarSign, LogOut,
  Phone, ChevronLeft, Sparkles, Trophy, Cpu, 
  FileSearch, Search, LayoutDashboard,
  Eye, EyeOff, TrendingUp, Clock3,
  Smartphone as SmartphoneIcon
} from 'lucide-react';
import { Order, OrderStatus, Message } from './types';
import { getLogisticsAdvice } from './services/geminiService';

const SUPPORT_PHONE = '5527998070773';
const WHATSAPP_LINK = `https://wa.me/${SUPPORT_PHONE}`;

type BDRNotification = {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
};

type QuoteRequest = {
  id: string;
  name: string;
  phone: string;
  device: string;
  problem: string;
  status: 'PENDING' | 'ANALYZED' | 'FINISHED';
  timestamp: Date;
};

const LogoComponent: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const scale = size === 'sm' ? 'scale-[0.5]' : size === 'lg' ? 'scale-125' : 'scale-100';
  return (
    <div className={`flex flex-col items-center justify-center leading-none select-none ${scale}`}>
      <div className="flex items-center gap-2">
        <span className="text-[#87ff00] font-[900] text-3xl tracking-tighter italic">BDR</span>
        <div className="flex items-center gap-1">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <Wrench className="text-[#87ff00] w-6 h-6 absolute rotate-45" />
            <Wrench className="text-[#87ff00] w-6 h-6 absolute -rotate-45" />
          </div>
          <SmartphoneIcon className="text-white w-6 h-6 fill-white" />
        </div>
      </div>
      <span className="text-white font-[900] text-3xl tracking-widest mt-[-4px]">SMART</span>
    </div>
  );
};

const LuckyWheel: React.FC<{ onWin: (amount: number, code: string) => void }> = ({ onWin }) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [wheelUsed, setWheelUsed] = useState(() => {
    return localStorage.getItem('bdr_wheel_used') === 'true';
  });
  const [wonAmount, setWonAmount] = useState<number | null>(() => {
    const val = localStorage.getItem('bdr_won_amount');
    return val ? parseInt(val) : null;
  });
  const [winningCode, setWinningCode] = useState<string>(() => {
    return localStorage.getItem('bdr_win_code') || '';
  });

  const prizes = [5, 10, 50, 15, 20, 30, 5, 25]; 
  const colors = ["#111", "#87ff00", "#111", "#87ff00", "#111", "#87ff00", "#111", "#87ff00"];

  const handleSpinClick = () => {
    if (isSpinning || wheelUsed) return;
    
    const newPrizeNumber = Math.floor(Math.random() * prizes.length);
    const extraDegrees = (360 / prizes.length) * newPrizeNumber;
    const totalRotation = rotation + (360 * 10) + (360 - (extraDegrees % 360));
    
    setRotation(totalRotation);
    setIsSpinning(true);

    setTimeout(() => {
      const amount = prizes[newPrizeNumber];
      const code = `BDR${amount}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      
      setIsSpinning(false);
      setHasWon(true);
      setWheelUsed(true);
      setWonAmount(amount);
      setWinningCode(code);
      
      localStorage.setItem('bdr_wheel_used', 'true');
      localStorage.setItem('bdr_won_amount', amount.toString());
      localStorage.setItem('bdr_win_code', code);
      
      onWin(amount, code);
    }, 4000);
  };

  return (
    <div className="bg-[#111] border border-white/5 rounded-[2.5rem] p-6 flex flex-col items-center gap-6 overflow-hidden relative shadow-2xl">
      <div className="text-center">
        <h3 className="text-sm font-black uppercase italic leading-none flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-[#87ff00]" /> {wheelUsed ? 'Seu Cupom BDR' : 'Roleta de Descontos'}
        </h3>
        <p className="text-[9px] text-white/40 font-black uppercase tracking-widest mt-1">
          {wheelUsed ? 'Código salvo em seu dispositivo' : 'Gire e ganhe até R$ 50,00 off'}
        </p>
      </div>

      <div className="relative w-48 h-48">
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20">
          <div className="w-4 h-6 bg-white rounded-full shadow-lg flex items-center justify-center">
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-black mt-2"></div>
          </div>
        </div>

        <div 
          className={`w-full h-full rounded-full border-4 border-white/10 relative transition-transform duration-[4000ms] cubic-bezier(0.15, 0, 0.15, 1) ${wheelUsed && !isSpinning ? 'grayscale opacity-20' : ''}`}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {prizes.map((prize, i) => (
            <div key={i} className="absolute top-0 left-0 w-full h-full" style={{ transform: `rotate(${(360 / prizes.length) * i}deg)`, clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 25%)' }}>
              <div className="w-full h-full" style={{ backgroundColor: colors[i], transform: `rotate(${360 / (prizes.length * 2)}deg)` }}></div>
            </div>
          ))}
          {prizes.map((prize, i) => (
            <div key={`text-${i}`} className="absolute top-0 left-0 w-full h-full flex justify-center pt-4" style={{ transform: `rotate(${(360 / prizes.length) * i + (360 / (prizes.length * 2))}deg)` }}>
              <span className={`text-[10px] font-black italic ${colors[i] === '#87ff00' ? 'text-black' : 'text-[#87ff00]'}`}>R${prize}</span>
            </div>
          ))}
          <div className="absolute inset-0 m-auto w-12 h-12 bg-black border-4 border-white/10 rounded-full flex items-center justify-center z-10 shadow-2xl">
            <div className="w-2 h-2 bg-[#87ff00] rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      <button onClick={handleSpinClick} disabled={isSpinning || wheelUsed} className={`w-full py-4 rounded-2xl font-black uppercase italic text-xs transition-all ${wheelUsed ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-[#87ff00] text-black shadow-[0_10px_30px_rgba(135,255,0,0.3)] active:scale-95'}`}>
        {isSpinning ? 'Sorteando...' : wheelUsed ? 'Giro Único Realizado' : 'Girar Agora'}
      </button>

      {hasWon && wonAmount && (
        <div className="fixed inset-0 z-[500] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in duration-500">
          <Trophy className="w-12 h-12 text-[#87ff00] mb-6 animate-bounce" />
          <h4 className="text-3xl font-[900] italic uppercase text-white">VOCÊ GANHOU!</h4>
          <p className="text-5xl font-[900] text-[#87ff00] mt-4 italic mb-2 tracking-tighter">R$ {wonAmount},00 OFF</p>
          <div className="w-full max-w-xs mt-8 p-6 bg-white/5 rounded-[2rem] border-2 border-dashed border-[#87ff00]/30">
            <p className="text-[10px] font-black text-[#87ff00] uppercase mb-2">CÓDIGO: {winningCode}</p>
            <p className="text-[13px] font-black text-white uppercase italic">Tire um <span className="text-[#87ff00] underline">PRINT</span> agora!</p>
          </div>
          <button onClick={() => setHasWon(false)} className="mt-12 bg-white text-black px-12 py-4 rounded-2xl font-black text-xs uppercase italic">Confirmado!</button>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isLogged, setIsLogged] = useState(false);
  const [view, setView] = useState<'customer' | 'driver' | 'admin'>('customer');
  const [activeTab, setActiveTab] = useState<'home' | 'orders' | 'profile' | 'quotes'>('home');
  const [adminTab, setAdminTab] = useState<'overview' | 'orders' | 'quotes'>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [notifications, setNotifications] = useState<BDRNotification[]>([]);
  
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', text: 'Olá! Sou o BDR BOT. Especialista em transporte e reparo de celulares. Como posso ajudar hoje?', timestamp: new Date() }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [adminPin, setAdminPin] = useState('');
  const [driverPin, setDriverPin] = useState('');
  const [showAdminPin, setShowAdminPin] = useState(false);
  const [showDriverPin, setShowDriverPin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [newOrder, setNewOrder] = useState({ name: '', phone: '', origin: '', destination: '', brand: '', model: '', desc: '' });
  const [newQuote, setNewQuote] = useState({ name: '', phone: '', device: '', problem: '' });

  useEffect(() => {
    const handlePopState = () => {
      setIsFormOpen(false);
      setIsQuoteFormOpen(false);
      setIsChatOpen(false);
    };
    window.addEventListener('popstate', handlePopState);

    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const addNotification = (title: string, message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [{ id, title, message, type }, ...prev]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 4000);
  };

  const handleLogin = (role: 'customer' | 'driver' | 'admin') => {
    if (role === 'admin' && adminPin !== '710512') return addNotification('Erro', 'Código administrativo incorreto', 'warning');
    if (role === 'driver' && driverPin !== 'coleta') return addNotification('Erro', 'Senha de motorista incorreta', 'warning');
    setView(role);
    setIsLogged(true);
    addNotification('Acesso Autorizado', `Perfil ${role.toUpperCase()} conectado`, 'success');
  };

  const openOverlay = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter(true);
    window.history.pushState({ modal: true }, "");
  };

  const closeOverlay = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter(false);
    if (window.history.state?.modal) {
      window.history.back();
    }
  };

  const handleCreateQuote = () => {
    if(!newQuote.name || !newQuote.device || !newQuote.problem) {
      return addNotification('Atenção', 'Preencha todos os campos do orçamento.', 'warning');
    }
    const quote: QuoteRequest = {
      id: `Q-${Math.floor(1000 + Math.random() * 9000)}`,
      ...newQuote,
      status: 'PENDING',
      timestamp: new Date()
    };
    setQuotes(prev => [quote, ...prev]);
    closeOverlay(setIsQuoteFormOpen);
    addNotification('Sucesso', 'Solicitação de orçamento enviada!', 'success');
    setNewQuote({ name: '', phone: '', device: '', problem: '' });
  };

  const handleCreateOrder = () => {
    if(!newOrder.name || !newOrder.phone || !newOrder.origin || !newOrder.brand) {
      return addNotification('Atenção', 'Preencha os dados do cliente e da coleta.', 'warning');
    }
    const order: Order = {
      id: `BDR-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: newOrder.name,
      customerPhone: newOrder.phone,
      origin: newOrder.origin,
      destination: newOrder.destination || 'Assistência Parceira',
      deviceBrand: newOrder.brand,
      deviceModel: newOrder.model,
      serviceDescription: newOrder.desc,
      status: OrderStatus.PENDING,
      createdAt: new Date(),
      estimatedCost: 35.00
    };
    setOrders(prev => [order, ...prev]);
    closeOverlay(setIsFormOpen);
    addNotification('Sucesso', 'Chamado de coleta aberto!', 'success');
    setNewOrder({ name: '', phone: '', origin: '', destination: '', brand: '', model: '', desc: '' });
  };

  const updateOrderStatus = (id: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? {...o, status: newStatus} : o));
    addNotification('Status Atualizado', `Pedido ${id} agora está ${newStatus}`, 'info');
  };

  const updateQuoteStatus = (id: string, newStatus: QuoteRequest['status']) => {
    setQuotes(prev => prev.map(q => q.id === id ? {...q, status: newStatus} : q));
    addNotification('Orçamento Atualizado', `Orçamento ${id} atualizado para ${newStatus}`, 'info');
  };

  const handleSendMessage = async () => {
    if(!chatInput.trim()) return;
    const msg = chatInput;
    setChatInput('');
    setMessages(prev => [...prev, {id: Date.now().toString(), role:'user', text: msg, timestamp: new Date()}]);
    setIsTyping(true);
    const response = await getLogisticsAdvice(msg);
    setMessages(prev => [...prev, {id: Date.now().toString()+1, role:'model', text: response, timestamp: new Date()}]);
    setIsTyping(false);
  };

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[100]">
        <LogoComponent size="lg" />
        <div className="absolute bottom-12 flex flex-col items-center">
          <div className="w-8 h-1 bg-[#87ff00]/20 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-[#87ff00] w-1/2 animate-[loading_1.5s_infinite_ease-in-out]"></div>
          </div>
          <p className="text-[#87ff00] text-[10px] font-black uppercase tracking-[0.3em]">Inicializando BDR SMART...</p>
        </div>
        <style>{` @keyframes loading { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } } `}</style>
      </div>
    );
  }

  if (!isLogged) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col p-8 z-[150] overflow-y-auto">
        <div className="mt-12 mb-16"><LogoComponent size="lg" /></div>
        <div className="space-y-6 flex-1">
          <h2 className="text-3xl font-black italic uppercase">Acesse sua <br/><span className="text-[#87ff00]">Operação</span></h2>
          <div className="space-y-4">
            <button onClick={() => handleLogin('customer')} className="w-full bg-[#111] border border-white/5 p-6 rounded-[2rem] flex items-center justify-between group active:scale-95 transition-all shadow-xl">
              <div className="flex items-center gap-4">
                <div className="bg-[#87ff00] p-3 rounded-2xl text-black"><User className="w-6 h-6" /></div>
                <p className="font-black italic uppercase text-white">Entrar como Cliente</p>
              </div>
              <ChevronRight className="w-5 h-5 text-white/20" />
            </button>
            
            <div className="bg-[#111] border border-white/5 p-6 rounded-[2rem] space-y-4 shadow-xl">
              <div className="relative">
                <input 
                  type={showDriverPin ? "text" : "password"} 
                  placeholder="SENHA MOTORISTA" 
                  className="w-full bg-transparent border-b border-white/10 pb-4 outline-none text-xs font-black uppercase text-white placeholder:text-white/10" 
                  value={driverPin} 
                  onChange={e => setDriverPin(e.target.value)} 
                />
                <button onClick={() => setShowDriverPin(!showDriverPin)} className="absolute right-0 top-0 text-white/20">
                  {showDriverPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <button onClick={() => handleLogin('driver')} className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase italic text-xs active:scale-95 transition-transform">Entrar Motorista</button>
            </div>

            <div className="bg-[#111] border border-white/5 p-6 rounded-[2rem] space-y-4 shadow-xl">
              <div className="relative">
                <input 
                  type={showAdminPin ? "text" : "password"} 
                  placeholder="PIN ADMINISTRADOR" 
                  className="w-full bg-transparent border-b border-white/10 pb-4 outline-none text-xs font-black uppercase text-[#87ff00] placeholder:text-white/10" 
                  value={adminPin} 
                  onChange={e => setAdminPin(e.target.value)} 
                />
                <button onClick={() => setShowAdminPin(!showAdminPin)} className="absolute right-0 top-0 text-white/20">
                  {showAdminPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <button onClick={() => handleLogin('admin')} className="w-full bg-[#87ff00] text-black py-4 rounded-2xl font-black uppercase italic text-xs shadow-[0_5px_15px_rgba(135,255,0,0.3)] active:scale-95 transition-transform">Painel Gerencial</button>
            </div>
          </div>
          <p className="text-[8px] text-white/5 text-center uppercase font-black mt-8 tracking-widest">BDR SMART SECURITY ENFORCED</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-black text-white overflow-hidden relative font-sans">
      <div className="fixed top-14 left-0 right-0 z-[200] px-4 pointer-events-none flex flex-col gap-2">
        {notifications.map(n => (
          <div key={n.id} className="pointer-events-auto bg-[#111]/95 backdrop-blur-md border-l-4 border-[#87ff00] rounded-2xl p-4 shadow-2xl animate-in slide-in-from-top">
            <div className="flex items-start gap-3">
              <Bell className="w-4 h-4 text-[#87ff00]" />
              <div><h4 className="text-[10px] font-black uppercase text-[#87ff00]">{n.title}</h4><p className="text-xs font-medium text-white/80">{n.message}</p></div>
            </div>
          </div>
        ))}
      </div>

      {view === 'customer' && (
        <a 
          href={WHATSAPP_LINK} 
          target="_blank" 
          rel="noopener noreferrer"
          className="fixed bottom-32 right-6 z-[400] bg-[#25D366] text-white p-4 rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.4)] active:scale-90 transition-transform flex items-center justify-center animate-in slide-in-from-right duration-700"
        >
          <Phone className="w-6 h-6 fill-white" />
        </a>
      )}

      <header className="px-5 pt-12 pb-4 flex items-center justify-between border-b border-white/10 shrink-0 bg-black/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="flex items-center">
          {view === 'admin' ? (
             <button onClick={() => { setIsLogged(false); setView('customer'); }} className="p-2 -ml-2 text-white/20 flex items-center gap-2"><LogOut className="w-5 h-5" /><span className="text-[10px] font-black uppercase italic">Logout Admin</span></button>
          ) : activeTab !== 'home' ? (
            <button onClick={() => setActiveTab('home')} className="p-2 -ml-2 text-[#87ff00]"><ChevronLeft className="w-6 h-6" /></button>
          ) : (
            <div className="scale-75 -ml-6"><LogoComponent size="sm" /></div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {view !== 'admin' && (
            <>
              <button onClick={() => openOverlay(setIsChatOpen)} className="p-3 bg-white/5 rounded-2xl text-[#87ff00] relative"><MessageSquare className="w-5 h-5" /></button>
              <button onClick={() => setActiveTab('profile')} className={`p-3 rounded-2xl ${activeTab === 'profile' ? 'bg-[#87ff00] text-black' : 'bg-white/5 text-white'}`}><User className="w-5 h-5" /></button>
            </>
          )}
          {view === 'admin' && (
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
              <Activity className="w-4 h-4 text-[#87ff00] animate-pulse" />
              <span className="text-[10px] font-black uppercase italic">Monitoring</span>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-48">
        {view === 'admin' ? (
          <div className="p-5 space-y-6">
            <div className="flex items-center gap-4 border-b border-white/5 pb-2 overflow-x-auto no-scrollbar">
              <button onClick={() => setAdminTab('overview')} className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase italic transition-all ${adminTab === 'overview' ? 'bg-[#87ff00] text-black shadow-lg' : 'bg-white/5 text-white/40'}`}>
                <LayoutDashboard className="w-3 h-3" /> Dashboard
              </button>
              <button onClick={() => setAdminTab('orders')} className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase italic transition-all ${adminTab === 'orders' ? 'bg-[#87ff00] text-black shadow-lg' : 'bg-white/5 text-white/40'}`}>
                <Package className="w-3 h-3" /> Entregas
              </button>
              <button onClick={() => setAdminTab('quotes')} className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase italic transition-all ${adminTab === 'quotes' ? 'bg-[#87ff00] text-black shadow-lg' : 'bg-white/5 text-white/40'}`}>
                <FileSearch className="w-3 h-3" /> Reparos
              </button>
            </div>

            {adminTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-500">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#111] p-6 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity"><DollarSign className="w-16 h-16" /></div>
                    <div className="flex justify-between mb-4">
                      <Zap className="w-5 h-5 text-[#87ff00]" />
                      <span className="text-[8px] font-black text-[#87ff00] bg-[#87ff00]/10 px-2 py-1 rounded-full flex items-center gap-1"><TrendingUp className="w-2 h-2" /> +24%</span>
                    </div>
                    <p className="text-[9px] font-black text-white/40 uppercase">Faturamento Mes</p>
                    <p className="text-2xl font-black italic">R$ 4.280</p>
                  </div>
                  <div className="bg-[#111] p-6 rounded-[2.5rem] border border-white/5 shadow-2xl">
                    <div className="flex justify-between mb-4">
                      <Clock3 className="w-5 h-5 text-[#87ff00]" />
                    </div>
                    <p className="text-[9px] font-black text-white/40 uppercase">Tempo Médio</p>
                    <p className="text-2xl font-black italic">42 min</p>
                  </div>
                </div>

                <div className="bg-[#111] p-6 rounded-[2.5rem] border border-white/5 relative overflow-hidden shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-xs font-black uppercase italic">Fluxo de Logística</h4>
                    <BarChart3 className="w-4 h-4 text-[#87ff00]" />
                  </div>
                  <div className="space-y-4">
                    {orders.length === 0 ? (
                      <div className="flex flex-col items-center py-6 text-white/10">
                        <Package className="w-10 h-10 mb-2" />
                        <p className="text-[10px] font-black uppercase">Nenhum dado ativo</p>
                      </div>
                    ) : (
                      orders.slice(0, 4).map(o => (
                        <div key={o.id} className="flex items-center justify-between bg-black/30 p-4 rounded-3xl border border-white/5 hover:border-[#87ff00]/20 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className={`w-2 h-2 rounded-full ${o.status === OrderStatus.DELIVERED ? 'bg-[#87ff00]' : 'bg-orange-500 animate-pulse'}`}></div>
                            <div>
                              <p className="text-[11px] font-black uppercase leading-none mb-1">{o.customerName}</p>
                              <p className="text-[8px] text-white/30 uppercase font-black">{o.deviceModel}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-black italic text-[#87ff00]">R$ {o.estimatedCost.toFixed(2)}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {(adminTab === 'orders' || adminTab === 'quotes') && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right duration-500">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-4 flex items-center gap-3 shadow-inner">
                  <Search className="w-4 h-4 text-[#87ff00]" />
                  <input 
                    type="text" 
                    placeholder="Filtrar por nome, aparelho ou ID..." 
                    className="flex-1 bg-transparent border-0 outline-none text-[10px] font-black uppercase text-white placeholder:text-white/10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="space-y-4">
                  {adminTab === 'orders' ? (
                    orders.filter(o => o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || o.deviceModel.toLowerCase().includes(searchTerm.toLowerCase())).map(o => (
                      <div key={o.id} className="bg-[#111] border border-white/5 p-6 rounded-[2.5rem] relative group transition-all hover:border-[#87ff00]/30 shadow-2xl">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex flex-col gap-2">
                            <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-full w-fit ${o.status === OrderStatus.DELIVERED ? 'bg-[#87ff00] text-black' : 'bg-orange-500/20 text-orange-500'}`}>{o.status}</span>
                            <h4 className="text-sm font-black italic uppercase leading-none">{o.customerName}</h4>
                          </div>
                          <span className="text-[9px] font-black text-white/20 tracking-tighter">{o.id}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-black/50 p-3 rounded-2xl border border-white/5">
                            <p className="text-[7px] text-white/30 font-black uppercase mb-1">Aparelho</p>
                            <p className="text-[10px] font-black uppercase">{o.deviceBrand} {o.deviceModel}</p>
                          </div>
                          <div className="bg-black/50 p-3 rounded-2xl border border-white/5">
                            <p className="text-[7px] text-white/30 font-black uppercase mb-1">Contato</p>
                            <p className="text-[10px] font-black uppercase">{o.customerPhone}</p>
                          </div>
                        </div>
                        <p className="text-[9px] text-white/40 uppercase mb-4 flex items-center gap-2"><MapPin className="w-3 h-3 text-[#87ff00]" /> {o.origin.substring(0, 35)}...</p>
                        
                        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                           <button onClick={() => updateOrderStatus(o.id, OrderStatus.IN_TRANSIT)} className="bg-white/5 py-3 rounded-2xl text-[8px] font-black uppercase italic hover:bg-white/10 active:scale-95 transition-all">Em Rota</button>
                           <button onClick={() => updateOrderStatus(o.id, OrderStatus.DELIVERED)} className="bg-[#87ff00] text-black py-3 rounded-2xl text-[8px] font-black uppercase italic shadow-lg active:scale-95 transition-all">Finalizar</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    quotes.filter(q => q.name.toLowerCase().includes(searchTerm.toLowerCase()) || q.device.toLowerCase().includes(searchTerm.toLowerCase())).map(q => (
                      <div key={q.id} className="bg-[#111] border border-white/5 p-6 rounded-[2.5rem] relative transition-all hover:border-[#87ff00]/30 shadow-2xl">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex flex-col gap-2">
                            <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-full w-fit ${q.status === 'PENDING' ? 'bg-orange-500/20 text-orange-500' : 'bg-blue-500/20 text-blue-500'}`}>{q.status}</span>
                            <h4 className="text-sm font-black italic uppercase leading-none">{q.name}</h4>
                          </div>
                          <span className="text-[9px] font-black text-white/20">{q.id}</span>
                        </div>
                        <div className="bg-black/40 p-4 rounded-2xl border border-white/5 mb-4">
                          <p className="text-[9px] font-black uppercase text-[#87ff00] mb-2">{q.device}</p>
                          <p className="text-[11px] text-white/70 italic leading-relaxed">"{q.problem}"</p>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase text-white/40"><Phone className="w-3 h-3 text-[#87ff00]" /> {q.phone}</div>
                          <button onClick={() => updateQuoteStatus(q.id, 'ANALYZED')} className="bg-white/5 px-5 py-3 rounded-2xl text-[8px] font-black uppercase italic hover:bg-white/10 active:scale-95 transition-all">Orçar Agora</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        ) : activeTab === 'profile' ? (
          <div className="p-5 space-y-6 animate-in fade-in slide-in-from-right duration-500">
            <div className="bg-[#111] p-10 rounded-[3rem] border border-white/5 flex flex-col items-center text-center shadow-2xl">
              <div className="w-28 h-28 bg-[#87ff00] rounded-full flex items-center justify-center mb-8 shadow-[0_15px_35px_rgba(135,255,0,0.3)]"><User className="w-14 h-14 text-black" /></div>
              <h2 className="text-2xl font-black italic uppercase">Usuário <span className="text-[#87ff00]">BDR</span></h2>
              <p className="text-[10px] text-white/20 font-black uppercase mt-2 tracking-widest">TOKEN: 882-BDR-X</p>
            </div>

            <a 
              href={WHATSAPP_LINK} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] p-8 rounded-[3rem] flex items-center justify-between shadow-2xl active:scale-95 transition-transform border border-white/10"
            >
              <div className="flex items-center gap-6 text-left">
                <Phone className="w-8 h-8 text-white fill-white" />
                <div>
                  <h4 className="text-sm font-black uppercase italic leading-none text-white">Suporte WhatsApp</h4>
                  <p className="text-[10px] text-white/60 font-black uppercase mt-2">(27) 99807-0773</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/40" />
            </a>

            <button onClick={() => setIsLogged(false)} className="w-full bg-red-500/10 p-6 rounded-3xl border border-red-500/20 text-red-500 font-black uppercase italic text-xs active:scale-95 transition-all hover:bg-red-500/20">Desconectar Operação</button>
          </div>
        ) : activeTab === 'orders' ? (
          <div className="p-5 space-y-6 animate-in fade-in slide-in-from-left duration-500">
            <h3 className="text-xl font-black uppercase italic">Meus <span className="text-[#87ff00]">Chamados</span></h3>
            {orders.length === 0 ? (
              <div className="text-center py-20 space-y-6 bg-[#111] rounded-[3rem] border border-white/5">
                <Package className="w-16 h-16 text-white/5 mx-auto" />
                <p className="text-[11px] text-white/20 uppercase font-black px-10">Você ainda não solicitou nenhuma coleta de aparelho.</p>
                <button onClick={() => openOverlay(setIsFormOpen)} className="bg-[#87ff00] text-black px-10 py-4 rounded-2xl font-black uppercase italic text-[11px] shadow-lg active:scale-95 transition-transform">Chamar Agora</button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(o => (
                  <div key={o.id} className="bg-[#111] p-8 rounded-[3rem] border border-white/5 relative shadow-2xl group active:scale-[0.98] transition-all">
                    <div className="flex justify-between mb-6">
                      <span className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-full ${o.status === OrderStatus.DELIVERED ? 'bg-[#87ff00] text-black' : 'bg-orange-500/20 text-orange-500'}`}>{o.status}</span>
                      <span className="text-[10px] font-black text-white/20 italic tracking-wider">{o.id}</span>
                    </div>
                    <h4 className="text-xl font-black uppercase italic leading-none mb-2">{o.deviceBrand} {o.deviceModel}</h4>
                    <p className="text-[11px] text-white/50 uppercase font-black mb-6">{o.customerName}</p>
                    <div className="flex items-center gap-3 text-[11px] text-white/30 mt-4 border-t border-white/5 pt-6">
                      <div className="bg-black p-2 rounded-xl border border-white/5"><MapPin className="w-4 h-4 text-[#87ff00]" /></div>
                      <span className="italic">{o.origin.substring(0, 40)}...</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'quotes' ? (
          <div className="p-5 space-y-6 animate-in fade-in slide-in-from-right duration-500">
            <h3 className="text-xl font-black uppercase italic">Meus <span className="text-[#87ff00]">Reparos</span></h3>
            {quotes.length === 0 ? (
              <div className="text-center py-20 space-y-6 bg-[#111] rounded-[3rem] border border-white/5">
                <FileSearch className="w-16 h-16 text-white/5 mx-auto" />
                <p className="text-[11px] text-white/20 uppercase font-black px-10">Solicite um orçamento de reparo sem sair de casa.</p>
                <button onClick={() => openOverlay(setIsQuoteFormOpen)} className="bg-white/5 border border-white/10 text-white px-10 py-4 rounded-2xl font-black uppercase italic text-[11px] hover:bg-white/10 active:scale-95 transition-all">Novo Orçamento</button>
              </div>
            ) : (
              <div className="space-y-4">
                {quotes.map(q => (
                  <div key={q.id} className="bg-[#111] p-8 rounded-[3rem] border border-white/5 shadow-2xl">
                    <div className="flex justify-between mb-6">
                      <span className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-full ${q.status === 'PENDING' ? 'bg-orange-500/20 text-orange-500' : 'bg-blue-500/20 text-blue-500'}`}>{q.status}</span>
                      <span className="text-[10px] font-black text-white/20 italic">{q.id}</span>
                    </div>
                    <h4 className="text-xl font-black uppercase italic leading-none">{q.device}</h4>
                    <div className="bg-black/50 p-6 rounded-[2rem] border border-white/5 mt-6 relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-5"><Wrench className="w-12 h-12" /></div>
                       <p className="text-[9px] text-white/30 uppercase font-black mb-3">Relato Técnico:</p>
                       <p className="text-xs text-white/80 italic leading-relaxed">"{q.problem}"</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="p-5 space-y-6 animate-in fade-in duration-700">
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => openOverlay(setIsFormOpen)}
                className="relative text-left bg-gradient-to-br from-[#111] to-black rounded-[3rem] p-8 border border-white/5 shadow-2xl overflow-hidden flex flex-col justify-between aspect-square active:scale-95 hover:border-[#87ff00]/30 transition-all group"
              >
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#87ff00]/5 rounded-full group-hover:scale-150 transition-transform"></div>
                <Zap className="w-8 h-8 text-[#87ff00] mb-4" />
                <div>
                  <h2 className="text-xl font-black uppercase italic leading-tight mb-4">LEVA E <br/><span className="text-[#87ff00]">TRAZ</span></h2>
                  <div className="bg-[#87ff00] text-black p-3 rounded-2xl shadow-lg w-fit"><Plus className="w-6 h-6" /></div>
                </div>
              </button>
              
              <button 
                onClick={() => openOverlay(setIsQuoteFormOpen)}
                className="relative text-left bg-[#111] rounded-[3rem] p-8 border border-white/5 flex flex-col justify-between aspect-square active:scale-95 hover:border-white/20 transition-all shadow-2xl group"
              >
                <FileSearch className="w-8 h-8 text-white/20 mb-4" />
                <div>
                  <h2 className="text-xl font-black uppercase italic leading-tight mb-4">PEDIR <br/><span className="text-white/40">ORÇAMENTO</span></h2>
                  <div className="bg-white/5 text-white p-3 rounded-2xl border border-white/10 group-hover:bg-white/10 w-fit"><Plus className="w-6 h-6" /></div>
                </div>
              </button>
            </div>

            <a 
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#111] p-8 rounded-[3rem] border border-white/5 flex items-center justify-between shadow-2xl active:scale-95 hover:border-[#25D366]/30 transition-all group"
            >
              <div className="flex items-center gap-6">
                 <div className="bg-[#25D366] p-4 rounded-3xl shadow-lg"><Phone className="w-6 h-6 text-white fill-white" /></div>
                 <div className="text-left">
                    <h4 className="text-sm font-black uppercase italic leading-none text-white">CHAMAR NO WHATSAPP</h4>
                    <p className="text-[10px] font-bold opacity-40 uppercase mt-2">Suporte Direto: (27) 99807-0773</p>
                 </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/10" />
            </a>

            <LuckyWheel onWin={(amt, code) => addNotification('SORTE NO BDR!', `Você ganhou R$ ${amt},00 de desconto`, 'success')} />
          </div>
        )}
      </main>

      {isQuoteFormOpen && (
        <div className="fixed inset-0 z-[600] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={() => closeOverlay(setIsQuoteFormOpen)}></div>
          <div className="relative bg-[#0a0a0a] rounded-t-[4rem] p-10 pb-16 border-t border-white/10 animate-in slide-in-from-bottom duration-500 max-h-[95vh] overflow-y-auto shadow-[0_-30px_60px_rgba(0,0,0,0.8)]">
            <div className="w-16 h-1.5 bg-white/10 rounded-full mx-auto mb-10"></div>
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-3xl font-black uppercase italic leading-none">Reparo <span className="text-[#87ff00]">BDR</span></h3>
              <button onClick={() => closeOverlay(setIsQuoteFormOpen)} className="p-3 bg-white/5 rounded-2xl text-white/40"><X className="w-6 h-6" /></button>
            </div>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <input type="text" placeholder="SEU NOME COMPLETO" className="w-full bg-white/5 border border-white/5 p-6 rounded-3xl text-[11px] font-black uppercase text-white outline-none focus:border-[#87ff00]/30 shadow-inner" value={newQuote.name} onChange={e => setNewQuote({...newQuote, name: e.target.value})} />
                <input type="text" placeholder="WHATSAPP DE CONTATO" className="w-full bg-white/5 border border-white/5 p-6 rounded-3xl text-[11px] font-black uppercase text-white outline-none focus:border-[#87ff00]/30 shadow-inner" value={newQuote.phone} onChange={e => setNewQuote({...newQuote, phone: e.target.value})} />
              </div>
              <div className="space-y-2">
                <input type="text" placeholder="APARELHO (EX: IPHONE 15 PRO)" className="w-full bg-white/5 border border-white/5 p-6 rounded-3xl text-[11px] font-black uppercase text-white outline-none focus:border-[#87ff00]/30 shadow-inner" value={newQuote.device} onChange={e => setNewQuote({...newQuote, device: e.target.value})} />
                <textarea placeholder="DESCREVA O PROBLEMA" rows={4} className="w-full bg-white/5 border border-white/5 p-6 rounded-3xl text-[11px] font-black uppercase text-white outline-none resize-none focus:border-[#87ff00]/30 shadow-inner" value={newQuote.problem} onChange={e => setNewQuote({...newQuote, problem: e.target.value})} />
              </div>
              <button onClick={handleCreateQuote} className="w-full bg-[#87ff00] text-black py-6 rounded-3xl font-black uppercase italic text-sm shadow-[0_15px_30px_rgba(135,255,0,0.3)] active:scale-95 mt-6">Solicitar Orçamento</button>
            </div>
          </div>
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-[600] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={() => closeOverlay(setIsFormOpen)}></div>
          <div className="relative bg-[#0a0a0a] rounded-t-[4rem] p-10 pb-16 border-t border-white/10 animate-in slide-in-from-bottom duration-500 max-h-[95vh] overflow-y-auto shadow-[0_-30px_60px_rgba(0,0,0,0.8)]">
            <div className="w-16 h-1.5 bg-white/10 rounded-full mx-auto mb-10"></div>
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-3xl font-black uppercase italic leading-none">Coleta <span className="text-[#87ff00]">Smart</span></h3>
              <button onClick={() => closeOverlay(setIsFormOpen)} className="p-3 bg-white/5 rounded-2xl text-white/40"><X className="w-6 h-6" /></button>
            </div>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <input type="text" placeholder="NOME DO CLIENTE" className="w-full bg-white/5 border border-white/5 p-6 rounded-3xl text-[11px] font-black uppercase text-white outline-none focus:border-[#87ff00]/30 shadow-inner" value={newOrder.name} onChange={e => setNewOrder({...newOrder, name: e.target.value})} />
                <input type="text" placeholder="WHATSAPP" className="w-full bg-white/5 border border-white/5 p-6 rounded-3xl text-[11px] font-black uppercase text-white outline-none focus:border-[#87ff00]/30 shadow-inner" value={newOrder.phone} onChange={e => setNewOrder({...newOrder, phone: e.target.value})} />
              </div>
              <div className="space-y-2">
                <input type="text" placeholder="ENDEREÇO COMPLETO" className="w-full bg-white/5 border border-white/5 p-6 rounded-3xl text-[11px] font-black uppercase text-white outline-none focus:border-[#87ff00]/30 shadow-inner" value={newOrder.origin} onChange={e => setNewOrder({...newOrder, origin: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="MARCA" className="w-full bg-white/5 border border-white/5 p-6 rounded-3xl text-[11px] font-black uppercase text-white outline-none focus:border-[#87ff00]/30 shadow-inner" value={newOrder.brand} onChange={e => setNewOrder({...newOrder, brand: e.target.value})} />
                  <input type="text" placeholder="MODELO" className="w-full bg-white/5 border border-white/5 p-6 rounded-3xl text-[11px] font-black uppercase text-white outline-none focus:border-[#87ff00]/30 shadow-inner" value={newOrder.model} onChange={e => setNewOrder({...newOrder, model: e.target.value})} />
                </div>
              </div>
              <textarea placeholder="INFORMAÇÕES ADICIONAIS" rows={3} className="w-full bg-white/5 border border-white/5 p-6 rounded-3xl text-[11px] font-black uppercase text-white outline-none resize-none focus:border-[#87ff00]/30 shadow-inner" value={newOrder.desc} onChange={e => setNewOrder({...newOrder, desc: e.target.value})} />
              <button onClick={handleCreateOrder} className="w-full bg-[#87ff00] text-black py-6 rounded-3xl font-black uppercase italic text-sm shadow-[0_15px_30px_rgba(135,255,0,0.3)] active:scale-95 mt-6">Confirmar Agendamento</button>
            </div>
          </div>
        </div>
      )}

      {isChatOpen && (
        <div className="fixed inset-0 z-[1000] bg-black flex flex-col animate-in slide-in-from-right duration-300">
           <header className="px-6 pt-14 pb-8 border-b border-white/5 flex items-center gap-5 bg-black/80 backdrop-blur-3xl sticky top-0 shadow-2xl">
              <button onClick={() => closeOverlay(setIsChatOpen)} className="p-3 -ml-2 bg-white/5 rounded-2xl text-[#87ff00]"><ChevronLeft className="w-6 h-6" /></button>
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-[#87ff00] rounded-[1.2rem] flex items-center justify-center shadow-[0_0_30px_rgba(135,255,0,0.3)]"><Cpu className="w-7 h-7 text-black" /></div>
                 <div>
                    <h4 className="text-md font-[900] uppercase italic text-white leading-none">BDR BOT</h4>
                    <p className="text-[9px] text-[#87ff00] font-black uppercase mt-1 tracking-widest flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#87ff00] rounded-full animate-pulse"></span> Sistema Online</p>
                 </div>
              </div>
           </header>
           <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-black to-[#050505]">
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[85%] p-5 rounded-[2rem] text-[11px] leading-relaxed shadow-2xl ${m.role === 'user' ? 'bg-[#87ff00] text-black rounded-tr-none' : 'bg-[#111] text-white border border-white/10 rounded-tl-none'}`}>
                      {m.text}
                   </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#111] border border-white/5 p-4 rounded-3xl flex gap-1.5 items-center shadow-2xl">
                    <div className="w-1.5 h-1.5 bg-[#87ff00] rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-[#87ff00] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-[#87ff00] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
           </div>
           <div className="p-6 border-t border-white/5 bg-black pb-12 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
              <div className="bg-[#111] border border-white/10 rounded-[2rem] p-3 flex items-center gap-3 shadow-inner">
                 <input type="text" placeholder="PERGUNTE AO BDR BOT..." className="flex-1 bg-transparent border-0 outline-none px-4 text-[11px] font-black uppercase text-white placeholder:text-white/10" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} />
                 <button onClick={handleSendMessage} className="bg-[#87ff00] text-black p-5 rounded-[1.5rem] active:scale-90 shadow-[0_5px_15px_rgba(135,255,0,0.3)]"><Send className="w-5 h-5" /></button>
              </div>
           </div>
        </div>
      )}

      {view === 'customer' && (
        <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-3xl border-t border-white/5 px-8 pt-6 pb-12 flex items-center justify-between z-50 shadow-[0_-20px_50px_rgba(0,0,0,0.4)]">
          <NavButton active={activeTab === 'home'} icon={<Home className="w-5 h-5" />} label="Home" onClick={() => setActiveTab('home')} />
          <NavButton active={activeTab === 'orders'} icon={<ClipboardList className="w-5 h-5" />} label="Status" onClick={() => setActiveTab('orders')} />
          <button onClick={() => openOverlay(setIsFormOpen)} className="bg-[#87ff00] text-black p-5 rounded-full shadow-[0_15px_40px_rgba(135,255,0,0.5)] -mt-16 border-[6px] border-black hover:scale-110 active:scale-90 transition-all group">
            <Plus className="w-7 h-7 stroke-[4px] group-hover:rotate-90 transition-transform" />
          </button>
          <NavButton active={activeTab === 'quotes'} icon={<FileSearch className="w-5 h-5" />} label="Orçar" onClick={() => setActiveTab('quotes')} />
          <NavButton active={activeTab === 'profile'} icon={<User className="w-5 h-5" />} label="Perfil" onClick={() => setActiveTab('profile')} />
        </nav>
      )}

      <style>{`
        @keyframes bounce-subtle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .animate-bounce-subtle { animation: bounce-subtle 3s infinite ease-in-out; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; icon: React.ReactNode; label: string; onClick: () => void }> = ({ active, icon, label, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1.5 transition-all ${active ? 'text-[#87ff00] scale-110' : 'text-white/20'}`}>
    {icon}<span className="text-[8px] font-black uppercase italic tracking-widest">{label}</span>
  </button>
);

export default App;
