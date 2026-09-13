export interface ProgramacaoHorarios {
  dias_semana: number[];
  hora_abertura: string; // formato "HH:mm"
  hora_fechamento: string; // formato "HH:mm"
}

export interface AtendimentoConfig {
  horario: string;
  status_operacional?: 'auto' | 'aberto' | 'fechado' | string;
  programacao_horarios?: ProgramacaoHorarios;
  tempo_entrega?: string;
  endereco?: string;
  whatsapp?: string;
  mensagem_padrao?: string;
  pagamentos?: string;
}

export interface StatusAtendimento {
  isOpen: boolean;
  label: string;
  badgeClass: 'status-open' | 'status-closed';
  detailMessage: string;
}

function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

/**
 * Avalia se o estabelecimento está aberto no momento fornecido (ou agora)
 */
export function getStoreStatus(config: AtendimentoConfig, now: Date = new Date()): StatusAtendimento {
  const statusOp = config.status_operacional || 'auto';

  if (statusOp === 'aberto') {
    return {
      isOpen: true,
      label: 'ABERTO AGORA',
      badgeClass: 'status-open',
      detailMessage: 'Recebendo pedidos normalmente',
    };
  }

  if (statusOp === 'fechado') {
    return {
      isOpen: false,
      label: 'FECHADO NO MOMENTO',
      badgeClass: 'status-closed',
      detailMessage: 'Fechado temporariamente no momento',
    };
  }

  // Modo Automático por Horários
  const prog = config.programacao_horarios;
  if (!prog || !prog.dias_semana || !prog.hora_abertura || !prog.hora_fechamento) {
    // Fallback defensivo: aberto por padrão
    return {
      isOpen: true,
      label: 'ABERTO AGORA',
      badgeClass: 'status-open',
      detailMessage: config.horario || 'Atendimento disponível',
    };
  }

  const currentDay = now.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = timeToMinutes(prog.hora_abertura);
  const closeMinutes = timeToMinutes(prog.hora_fechamento);

  const isOpenToday = prog.dias_semana.includes(currentDay);

  let isOpen = false;

  if (closeMinutes >= openMinutes) {
    // Turno no mesmo dia (ex: 18:00 às 23:30)
    isOpen = isOpenToday && currentMinutes >= openMinutes && currentMinutes < closeMinutes;
  } else {
    // Turno que vira a noite (ex: 18:00 às 02:00)
    const prevDay = (currentDay + 6) % 7;
    const wasOpenYesterday = prog.dias_semana.includes(prevDay);
    isOpen =
      (isOpenToday && currentMinutes >= openMinutes) ||
      (wasOpenYesterday && currentMinutes < closeMinutes);
  }

  if (isOpen) {
    return {
      isOpen: true,
      label: 'ABERTO AGORA',
      badgeClass: 'status-open',
      detailMessage: `Aberto até às ${prog.hora_fechamento}`,
    };
  }

  return {
    isOpen: false,
    label: 'FECHADO NO MOMENTO',
    badgeClass: 'status-closed',
    detailMessage: `Abre às ${prog.hora_abertura}`,
  };
}
