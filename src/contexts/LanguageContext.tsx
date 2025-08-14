import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, ...args: any[]) => string;
  formatDate: (date: Date) => string;
  formatTime: (date: Date) => string;
  formatNumber: (value: number) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.kpi': 'KPI Tracking',
    'nav.alerts': 'Alerts & Automation',
    'nav.embed': 'Embedded Mode',
    'nav.templates': 'Dashboard Templates',
    'nav.security': 'Security & Governance',
    'nav.data': 'Data Sources',
    'nav.upload': 'Upload Data',
    'nav.visualizations': 'Advanced Charts',
    'nav.connectors': 'Data Connectors',
    'nav.admin': 'Admin Panel',
    'nav.users': 'User Management',
    
    // KPI Tracking
    'kpi.title': 'KPI & Goal Tracking',
    'kpi.addNew': 'Add New KPI',
    'kpi.target': 'Target',
    'kpi.current': 'Current',
    'kpi.threshold': 'Threshold',
    'kpi.status.good': 'Good',
    'kpi.status.warning': 'Warning',
    'kpi.status.critical': 'Critical',
    'kpi.performance': 'Performance',
    'kpi.trend': 'Trend',
    
    // Embed
    'embed.title': 'Embedded Mode',
    'embed.generate': 'Generate Embed Code',
    'embed.copy': 'Copy to Clipboard',
    'embed.copied': 'Copied!',
    'embed.preview': 'Preview',
    'embed.options': 'Embed Options',
    'embed.theme': 'Theme',
    'embed.size': 'Size',
    'embed.autoRefresh': 'Auto Refresh',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.loading': 'Loading...',
    'common.success': 'Success',
    'common.error': 'Error',
    'common.language': 'Language',
  },
  es: {
    // Navigation
    'nav.dashboard': 'Tablero',
    'nav.kpi': 'Seguimiento de KPI',
    'nav.embed': 'Modo Integrado',
    'nav.templates': 'Plantillas de Tablero',
    'nav.security': 'Seguridad y Gobernanza',
    'nav.data': 'Fuentes de Datos',
    'nav.upload': 'Subir Datos',
    'nav.visualizations': 'Gráficos Avanzados',
    'nav.connectors': 'Conectores de Datos',
    'nav.admin': 'Panel de Admin',
    'nav.users': 'Gestión de Usuarios',
    
    // KPI Tracking
    'kpi.title': 'Seguimiento de KPI y Objetivos',
    'kpi.addNew': 'Agregar Nuevo KPI',
    'kpi.target': 'Objetivo',
    'kpi.current': 'Actual',
    'kpi.threshold': 'Umbral',
    'kpi.status.good': 'Bueno',
    'kpi.status.warning': 'Advertencia',
    'kpi.status.critical': 'Crítico',
    'kpi.performance': 'Rendimiento',
    'kpi.trend': 'Tendencia',
    
    // Embed
    'embed.title': 'Modo Integrado',
    'embed.generate': 'Generar Código de Integración',
    'embed.copy': 'Copiar al Portapapeles',
    'embed.copied': '¡Copiado!',
    'embed.preview': 'Vista Previa',
    'embed.options': 'Opciones de Integración',
    'embed.theme': 'Tema',
    'embed.size': 'Tamaño',
    'embed.autoRefresh': 'Actualización Automática',
    
    // Common
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.edit': 'Editar',
    'common.delete': 'Eliminar',
    'common.loading': 'Cargando...',
    'common.success': 'Éxito',
    'common.error': 'Error',
    'common.language': 'Idioma',
  },
  fr: {
    // Navigation
    'nav.dashboard': 'Tableau de Bord',
    'nav.kpi': 'Suivi des KPI',
    'nav.embed': 'Mode Intégré',
    'nav.templates': 'Modèles de Tableau',
    'nav.security': 'Sécurité et Gouvernance',
    'nav.data': 'Sources de Données',
    'nav.upload': 'Télécharger Données',
    'nav.visualizations': 'Graphiques Avancés',
    'nav.connectors': 'Connecteurs de Données',
    'nav.admin': 'Panneau Admin',
    'nav.users': 'Gestion Utilisateurs',
    
    // KPI Tracking
    'kpi.title': 'Suivi des KPI et Objectifs',
    'kpi.addNew': 'Ajouter Nouveau KPI',
    'kpi.target': 'Objectif',
    'kpi.current': 'Actuel',
    'kpi.threshold': 'Seuil',
    'kpi.status.good': 'Bon',
    'kpi.status.warning': 'Attention',
    'kpi.status.critical': 'Critique',
    'kpi.performance': 'Performance',
    'kpi.trend': 'Tendance',
    
    // Embed
    'embed.title': 'Mode Intégré',
    'embed.generate': 'Générer Code Intégration',
    'embed.copy': 'Copier',
    'embed.copied': 'Copié!',
    'embed.preview': 'Aperçu',
    'embed.options': 'Options Intégration',
    'embed.theme': 'Thème',
    'embed.size': 'Taille',
    'embed.autoRefresh': 'Actualisation Auto',
    
    // Common
    'common.save': 'Sauvegarder',
    'common.cancel': 'Annuler',
    'common.edit': 'Modifier',
    'common.delete': 'Supprimer',
    'common.loading': 'Chargement...',
    'common.success': 'Succès',
    'common.error': 'Erreur',
    'common.language': 'Langue',
  },
  de: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.kpi': 'KPI-Verfolgung',
    'nav.embed': 'Eingebetteter Modus',
    'nav.templates': 'Dashboard-Vorlagen',
    'nav.security': 'Sicherheit & Governance',
    'nav.data': 'Datenquellen',
    'nav.upload': 'Daten Hochladen',
    'nav.visualizations': 'Erweiterte Diagramme',
    'nav.connectors': 'Datenverbindungen',
    'nav.admin': 'Admin-Panel',
    'nav.users': 'Benutzerverwaltung',
    
    // KPI Tracking
    'kpi.title': 'KPI & Zielverfolgung',
    'kpi.addNew': 'Neuen KPI Hinzufügen',
    'kpi.target': 'Ziel',
    'kpi.current': 'Aktuell',
    'kpi.threshold': 'Schwellenwert',
    'kpi.status.good': 'Gut',
    'kpi.status.warning': 'Warnung',
    'kpi.status.critical': 'Kritisch',
    'kpi.performance': 'Leistung',
    'kpi.trend': 'Trend',
    
    // Embed
    'embed.title': 'Eingebetteter Modus',
    'embed.generate': 'Einbettungscode Generieren',
    'embed.copy': 'Kopieren',
    'embed.copied': 'Kopiert!',
    'embed.preview': 'Vorschau',
    'embed.options': 'Einbettungsoptionen',
    'embed.theme': 'Design',
    'embed.size': 'Größe',
    'embed.autoRefresh': 'Auto-Aktualisierung',
    
    // Common
    'common.save': 'Speichern',
    'common.cancel': 'Abbrechen',
    'common.edit': 'Bearbeiten',
    'common.delete': 'Löschen',
    'common.loading': 'Lädt...',
    'common.success': 'Erfolg',
    'common.error': 'Fehler',
    'common.language': 'Sprache',
  },
  zh: {
    // Navigation
    'nav.dashboard': '仪表板',
    'nav.kpi': 'KPI跟踪',
    'nav.embed': '嵌入模式',
    'nav.templates': '仪表板模板',
    'nav.security': '安全与治理',
    'nav.data': '数据源',
    'nav.upload': '上传数据',
    'nav.visualizations': '高级图表',
    'nav.connectors': '数据连接器',
    'nav.admin': '管理面板',
    'nav.users': '用户管理',
    
    // KPI Tracking
    'kpi.title': 'KPI与目标跟踪',
    'kpi.addNew': '添加新KPI',
    'kpi.target': '目标',
    'kpi.current': '当前',
    'kpi.threshold': '阈值',
    'kpi.status.good': '良好',
    'kpi.status.warning': '警告',
    'kpi.status.critical': '严重',
    'kpi.performance': '表现',
    'kpi.trend': '趋势',
    
    // Embed
    'embed.title': '嵌入模式',
    'embed.generate': '生成嵌入代码',
    'embed.copy': '复制到剪贴板',
    'embed.copied': '已复制！',
    'embed.preview': '预览',
    'embed.options': '嵌入选项',
    'embed.theme': '主题',
    'embed.size': '尺寸',
    'embed.autoRefresh': '自动刷新',
    
    // Common
    'common.save': '保存',
    'common.cancel': '取消',
    'common.edit': '编辑',
    'common.delete': '删除',
    'common.loading': '加载中...',
    'common.success': '成功',
    'common.error': '错误',
    'common.language': '语言',
  },
  ja: {
    // Navigation
    'nav.dashboard': 'ダッシュボード',
    'nav.kpi': 'KPI追跡',
    'nav.embed': '埋め込みモード',
    'nav.templates': 'ダッシュボードテンプレート',
    'nav.security': 'セキュリティ・ガバナンス',
    'nav.data': 'データソース',
    'nav.upload': 'データアップロード',
    'nav.visualizations': '高度なチャート',
    'nav.connectors': 'データコネクタ',
    'nav.admin': '管理パネル',
    'nav.users': 'ユーザー管理',
    
    // KPI Tracking
    'kpi.title': 'KPI・目標追跡',
    'kpi.addNew': '新しいKPIを追加',
    'kpi.target': '目標',
    'kpi.current': '現在',
    'kpi.threshold': '閾値',
    'kpi.status.good': '良好',
    'kpi.status.warning': '警告',
    'kpi.status.critical': '重要',
    'kpi.performance': 'パフォーマンス',
    'kpi.trend': 'トレンド',
    
    // Embed
    'embed.title': '埋め込みモード',
    'embed.generate': '埋め込みコード生成',
    'embed.copy': 'クリップボードにコピー',
    'embed.copied': 'コピーしました！',
    'embed.preview': 'プレビュー',
    'embed.options': '埋め込みオプション',
    'embed.theme': 'テーマ',
    'embed.size': 'サイズ',
    'embed.autoRefresh': '自動更新',
    
    // Common
    'common.save': '保存',
    'common.cancel': 'キャンセル',
    'common.edit': '編集',
    'common.delete': '削除',
    'common.loading': '読み込み中...',
    'common.success': '成功',
    'common.error': 'エラー',
    'common.language': '言語',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string, ...args: any[]): string => {
    const translation = translations[language]?.[key as keyof typeof translations[typeof language]] || key;
    if (args.length === 0) return translation;
    
    return args.reduce((text, arg, index) => {
      return text.replace(`{${index}}`, arg);
    }, translation);
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat(language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const formatTime = (date: Date): string => {
    return new Intl.DateTimeFormat(language, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat(language).format(value);
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      t,
      formatDate,
      formatTime,
      formatNumber,
    }}>
      {children}
    </LanguageContext.Provider>
  );
};