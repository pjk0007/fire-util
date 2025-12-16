import {
    AlignLeft,
    ArrowUpRight,
    Baseline,
    Binary,
    BookOpen,
    Briefcase,
    Building2,
    Calendar,
    CaseSensitive,
    CheckCircle2,
    CircleChevronDown,
    CircleDot,
    Clock,
    Clock3,
    Code,
    Coffee,
    Coins,
    FileText,
    Flag,
    Folder,
    Hash,
    Heart,
    Home,
    Hourglass,
    Image,
    Inbox,
    Link,
    List,
    Loader,
    Mail,
    Map,
    MessageSquare,
    Paperclip,
    Phone,
    ShoppingCart,
    Sigma,
    Sparkles,
    Split,
    SquareCheck,
    Star,
    Tag,
    Target,
    Timer,
    TrendingUp,
    Trophy,
    User,
    UserCircle,
    Users,
    Zap,
} from 'lucide-react';

export enum IconName {
    Name = 'name',
    Clock = 'clock',
    String = 'string',
    Number = 'number',
    Boolean = 'boolean',
    Date = 'date',
    Status = 'status',
    Select = 'select',
    List = 'list',
    Relation = 'relation',
    File = 'file',
    Formula = 'formula',
    // Additional database-like icons
    Text = 'text',
    Email = 'email',
    Phone = 'phone',
    Url = 'url',
    Image = 'image',
    User = 'user',
    Users = 'users',
    Tag = 'tag',
    Flag = 'flag',
    Star = 'star',
    Heart = 'heart',
    Target = 'target',
    Trophy = 'trophy',
    Briefcase = 'briefcase',
    Folder = 'folder',
    Inbox = 'inbox',
    Mail = 'mail',
    ShoppingCart = 'shopping-cart',
    Coins = 'coins',
    TrendingUp = 'trending-up',
    Map = 'map',
    Home = 'home',
    Coffee = 'coffee',
    Sparkles = 'sparkles',
    Zap = 'zap',
    Code = 'code',
    Book = 'book',
    Dot = 'dot',
    // CRM & Business icons
    Hourglass = 'hourglass',
    Timer = 'timer',
    Building = 'building',
    UserCircle = 'user-circle',
    Message = 'message',
    CheckCircle = 'check-circle',
    Time = 'time',
    Split = 'split',
}

export function getIcon(name: IconName) {
    switch (name) {
        case IconName.Name:
            return <CaseSensitive className="size-4" />;
        case IconName.Clock:
            return <Clock3 className="size-4" />;
        case IconName.String:
            return <AlignLeft className="size-4" />;
        case IconName.Number:
            return <Hash className="size-4" />;
        case IconName.Boolean:
            return <SquareCheck className="size-4" />;
        case IconName.Date:
            return <Calendar className="size-4" />;
        case IconName.Status:
            return <Loader className="size-4" />;
        case IconName.Select:
            return <CircleChevronDown className="size-4" />;
        case IconName.List:
            return <List className="size-4" />;
        case IconName.Relation:
            return <ArrowUpRight className="size-4" />;
        case IconName.File:
            return <Paperclip className="size-4" />;
        case IconName.Formula:
            return <Sigma className="size-4" />;
        case IconName.Text:
            return <FileText className="size-4" />;
        case IconName.Email:
            return <Mail className="size-4" />;
        case IconName.Phone:
            return <Phone className="size-4" />;
        case IconName.Url:
            return <Link className="size-4" />;
        case IconName.Image:
            return <Image className="size-4" />;
        case IconName.User:
            return <User className="size-4" />;
        case IconName.Users:
            return <Users className="size-4" />;
        case IconName.Tag:
            return <Tag className="size-4" />;
        case IconName.Flag:
            return <Flag className="size-4" />;
        case IconName.Star:
            return <Star className="size-4" />;
        case IconName.Heart:
            return <Heart className="size-4" />;
        case IconName.Target:
            return <Target className="size-4" />;
        case IconName.Trophy:
            return <Trophy className="size-4" />;
        case IconName.Briefcase:
            return <Briefcase className="size-4" />;
        case IconName.Folder:
            return <Folder className="size-4" />;
        case IconName.Inbox:
            return <Inbox className="size-4" />;
        case IconName.Mail:
            return <Mail className="size-4" />;
        case IconName.ShoppingCart:
            return <ShoppingCart className="size-4" />;
        case IconName.Coins:
            return <Coins className="size-4" />;
        case IconName.TrendingUp:
            return <TrendingUp className="size-4" />;
        case IconName.Map:
            return <Map className="size-4" />;
        case IconName.Home:
            return <Home className="size-4" />;
        case IconName.Coffee:
            return <Coffee className="size-4" />;
        case IconName.Sparkles:
            return <Sparkles className="size-4" />;
        case IconName.Zap:
            return <Zap className="size-4" />;
        case IconName.Code:
            return <Code className="size-4" />;
        case IconName.Book:
            return <BookOpen className="size-4" />;
        case IconName.Dot:
            return <CircleDot className="size-4" />;
        case IconName.Hourglass:
            return <Hourglass className="size-4" />;
        case IconName.Timer:
            return <Timer className="size-4" />;
        case IconName.Building:
            return <Building2 className="size-4" />;
        case IconName.UserCircle:
            return <UserCircle className="size-4" />;
        case IconName.Message:
            return <MessageSquare className="size-4" />;
        case IconName.CheckCircle:
            return <CheckCircle2 className="size-4" />;
        case IconName.Time:
            return <Clock className="size-4" />;
        case IconName.Split:
            return <Split className="size-4" />;
        default:
            return null;
    }
}

export function getAllIcons(): {
    name: IconName;
    label: string;
    tags: string[];
}[] {
    return [
        {
            name: IconName.Name,
            label: '이름',
            tags: ['이름', 'name', '텍스트', 'text'],
        },
        {
            name: IconName.Clock,
            label: '시계',
            tags: ['시계', 'clock', '시간', 'time'],
        },
        {
            name: IconName.String,
            label: '문자열',
            tags: ['문자열', 'string', '텍스트', 'text', '글자'],
        },
        {
            name: IconName.Number,
            label: '숫자',
            tags: ['숫자', 'number', '번호', '#'],
        },
        {
            name: IconName.Boolean,
            label: '체크박스',
            tags: ['체크박스', 'checkbox', 'boolean', '불린', '선택'],
        },
        {
            name: IconName.Date,
            label: '날짜',
            tags: ['날짜', 'date', '달력', 'calendar'],
        },
        {
            name: IconName.Status,
            label: '상태',
            tags: ['상태', 'status', '진행상황', 'progress'],
        },
        {
            name: IconName.Select,
            label: '선택',
            tags: ['선택', 'select', '드롭다운', 'dropdown'],
        },
        {
            name: IconName.List,
            label: '목록',
            tags: ['목록', 'list', '다중선택', '멀티셀렉트'],
        },
        {
            name: IconName.Relation,
            label: '관계형',
            tags: ['관계형', 'relation', '레퍼런스', '참조'],
        },
        {
            name: IconName.Text,
            label: '텍스트',
            tags: ['텍스트', 'text', '글'],
        },
        {
            name: IconName.Email,
            label: '이메일',
            tags: ['이메일', 'email', '메일', 'mail'],
        },
        {
            name: IconName.Phone,
            label: '전화번호',
            tags: ['전화번호', 'phone', '전화', '연락처'],
        },
        {
            name: IconName.Url,
            label: 'URL',
            tags: ['url', 'link', '링크', '웹사이트'],
        },
        {
            name: IconName.Formula,
            label: '수식',
            tags: ['수식', 'formula', '계산', '함수'],
        },
        {
            name: IconName.File,
            label: '파일',
            tags: ['파일', 'file', '첨부', '문서'],
        },
        {
            name: IconName.Image,
            label: '이미지',
            tags: ['이미지', 'image', '사진', '그림'],
        },
        {
            name: IconName.User,
            label: '사용자',
            tags: ['사용자', 'user', '유저', '계정'],
        },
        {
            name: IconName.Users,
            label: '사용자들',
            tags: ['사용자들', 'users', '팀', '그룹'],
        },
        {
            name: IconName.Tag,
            label: '태그',
            tags: ['태그', 'tag', '라벨', 'label'],
        },
        {
            name: IconName.Flag,
            label: '플래그',
            tags: ['플래그', 'flag', '깃발', '마크'],
        },
        {
            name: IconName.Star,
            label: '별',
            tags: ['별', 'star', '즐겨찾기', 'favorite'],
        },
        {
            name: IconName.Heart,
            label: '하트',
            tags: ['하트', 'heart', '좋아요', 'like'],
        },
        {
            name: IconName.Target,
            label: '타겟',
            tags: ['타겟', 'target', '목표', '과녁'],
        },
        {
            name: IconName.Trophy,
            label: '트로피',
            tags: ['트로피', 'trophy', '상', '우승'],
        },
        {
            name: IconName.Briefcase,
            label: '서류가방',
            tags: ['서류가방', 'briefcase', '비즈니스', '업무'],
        },
        {
            name: IconName.Folder,
            label: '폴더',
            tags: ['폴더', 'folder', '디렉토리', '파일'],
        },
        {
            name: IconName.Inbox,
            label: '받은편지함',
            tags: ['받은편지함', 'inbox', '메일', '수신'],
        },
        {
            name: IconName.Mail,
            label: '메일',
            tags: ['메일', 'mail', '편지', '이메일'],
        },
        {
            name: IconName.ShoppingCart,
            label: '장바구니',
            tags: ['장바구니', 'cart', '쇼핑', '구매'],
        },
        {
            name: IconName.Coins,
            label: '동전',
            tags: ['동전', 'coins', '돈', '금액'],
        },
        {
            name: IconName.TrendingUp,
            label: '상승',
            tags: ['상승', 'trending', '증가', '성장'],
        },
        {
            name: IconName.Map,
            label: '지도',
            tags: ['지도', 'map', '위치', '장소'],
        },
        {
            name: IconName.Home,
            label: '홈',
            tags: ['홈', 'home', '집', '메인'],
        },
        {
            name: IconName.Coffee,
            label: '커피',
            tags: ['커피', 'coffee', '카페', '음료'],
        },
        {
            name: IconName.Sparkles,
            label: '반짝임',
            tags: ['반짝임', 'sparkles', '별', '특별'],
        },
        {
            name: IconName.Zap,
            label: '번개',
            tags: ['번개', 'zap', '빠른', '에너지'],
        },
        {
            name: IconName.Code,
            label: '코드',
            tags: ['코드', 'code', '프로그래밍', '개발'],
        },
        {
            name: IconName.Book,
            label: '책',
            tags: ['책', 'book', '문서', '교육'],
        },

        {
            name: IconName.Dot,
            label: '점',
            tags: ['점', 'dot', '원', '표시'],
        },
        {
            name: IconName.Hourglass,
            label: '모래시계',
            tags: ['모래시계', 'hourglass', '시간', '대기', '진행중'],
        },
        {
            name: IconName.Timer,
            label: '타이머',
            tags: ['타이머', 'timer', '시간', '스톱워치'],
        },
        {
            name: IconName.Building,
            label: '건물',
            tags: ['건물', 'building', '회사', '기업', '고객사', '조직'],
        },
        {
            name: IconName.UserCircle,
            label: '사용자 원형',
            tags: ['사용자', 'user', '프로필', '담당자', '연락처'],
        },
        {
            name: IconName.Message,
            label: '메시지',
            tags: ['메시지', 'message', '대화', '채팅', '댓글', '노트'],
        },
        {
            name: IconName.CheckCircle,
            label: '체크 원형',
            tags: ['체크', 'check', '완료', '성공', '승인', '확인'],
        },
        {
            name: IconName.Time,
            label: '시간',
            tags: ['시간', 'time', '시계', '일정', '스케줄'],
        },
        {
            name: IconName.Split,
            label: '분할',
            tags: ['분할', 'split', '나누기', '구분'],
        },
    ];
}
