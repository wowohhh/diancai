export interface Dish {
  id: number;
  name: string;
  desc: string;
  price: number;
  emoji: string;
  category: CategoryKey;
}

export type CategoryKey = 'signature' | 'hot' | 'cold' | 'soup' | 'staple' | 'dessert';

export interface Category {
  key: CategoryKey;
  label: string;
  emoji: string;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  emoji: string;
  qty: number;
}

export const DISHES: Dish[] = [
  { id: 1,  name: '秘制红烧肉',   desc: '肥而不腻，入口即化，酱香浓郁',       price: 58, emoji: '🍖', category: 'signature' },
  { id: 2,  name: '蒜蓉粉丝蒸虾',   desc: '鲜嫩Q弹，蒜香四溢，粉丝入味',       price: 68, emoji: '🦐', category: 'signature' },
  { id: 3,  name: '糖醋里脊',       desc: '外酥里嫩，酸甜可口，色泽金黄',       price: 45, emoji: '🥩', category: 'signature' },
  { id: 4,  name: '麻婆豆腐',       desc: '麻辣鲜香，嫩滑入味，下饭神器',       price: 28, emoji: '🌶️', category: 'hot' },
  { id: 5,  name: '干煸四季豆',     desc: '咸香微辣，口感脆嫩，越嚼越香',       price: 25, emoji: '🫘', category: 'hot' },
  { id: 6,  name: '宫保鸡丁',       desc: '花生酥脆，鸡肉嫩滑，经典川味',       price: 38, emoji: '🍗', category: 'hot' },
  { id: 7,  name: '鱼香肉丝',       desc: '酸甜微辣，肉丝鲜嫩，经典下饭菜',     price: 35, emoji: '🥢', category: 'hot' },
  { id: 8,  name: '番茄炒蛋',       desc: '国民家常菜，酸甜可口，简单幸福',     price: 22, emoji: '🍅', category: 'hot' },
  { id: 9,  name: '拍黄瓜',         desc: '清脆爽口，蒜香开胃，解腻必备',       price: 16, emoji: '🥒', category: 'cold' },
  { id: 10, name: '皮蛋豆腐',       desc: '冰凉爽滑，回味无穷，经典凉菜',       price: 18, emoji: '🥚', category: 'cold' },
  { id: 11, name: '口水鸡',         desc: '麻辣鲜香，鸡肉嫩滑，红油诱人',       price: 36, emoji: '🐔', category: 'cold' },
  { id: 12, name: '酸辣汤',         desc: '酸辣开胃，暖身暖心，料足味浓',       price: 22, emoji: '🥣', category: 'soup' },
  { id: 13, name: '排骨莲藕汤',     desc: '汤鲜味美，藕糯肉烂，营养滋补',       price: 48, emoji: '🍲', category: 'soup' },
  { id: 14, name: '番茄蛋花汤',     desc: '简单温暖的家常味，妈妈的味道',       price: 18, emoji: '🍜', category: 'soup' },
  { id: 15, name: '蛋炒饭',         desc: '粒粒分明，蛋香浓郁，简约不简单',     price: 20, emoji: '🍚', category: 'staple' },
  { id: 16, name: '手工水饺',       desc: '皮薄馅大，鲜美多汁，一口一个',       price: 30, emoji: '🥟', category: 'staple' },
  { id: 17, name: '葱油拌面',       desc: '葱香扑鼻，简单美味，劲道爽滑',       price: 18, emoji: '🍝', category: 'staple' },
  { id: 18, name: '红豆双皮奶',     desc: '细腻嫩滑，甜而不腻，入口即化',       price: 22, emoji: '🍮', category: 'dessert' },
  { id: 19, name: '冰镇桂花酸梅汤', desc: '清凉解暑，桂花飘香，酸甜回甘',       price: 15, emoji: '🍹', category: 'dessert' },
  { id: 20, name: '芒果椰汁西米露', desc: 'Q弹爽滑，热带风情，甜蜜满分',       price: 25, emoji: '🥭', category: 'dessert' },
];

export const CATEGORIES: Category[] = [
  { key: 'signature', label: '招牌推荐', emoji: '🔥' },
  { key: 'hot',       label: '热菜',     emoji: '🍳' },
  { key: 'cold',      label: '凉菜',     emoji: '🥗' },
  { key: 'soup',      label: '汤品',     emoji: '🍲' },
  { key: 'staple',    label: '主食',     emoji: '🍚' },
  { key: 'dessert',   label: '甜品饮品', emoji: '🍰' },
];
