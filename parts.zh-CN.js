/* 配方部件英译中配置。可在浏览器中直接加载，公开 window.PARTS_ZH_CN.translate(value)。 */
window.PARTS_ZH_CN = (() => {
  const species = {
    Angel: '天使',
    'Cursed Armor': '诅咒铠甲',
    Cybersaurus: '赛博恐龙',
    Cyclops: '独眼巨人',
    Demon: '恶魔',
    Draconid: '龙人',
    'Earth Elemental': '土元素',
    Fairy: '妖精',
    'Fire Elemental': '火元素',
    Harpy: '鹰身女妖',
    Illithid: '夺心魔',
    Jotun: '霜巨人',
    Jötunn: '霜巨人',
    'Lizard Man': '蜥蜴人',
    Mantis: '螳螂人',
    Mechanoid: '机械体',
    Mummy: '木乃伊',
    Orc: '兽人',
    'Orc Skeleton': '兽人骷髅',
    Skeleton: '骷髅',
    'Steel Golem': '钢铁魔像',
    'Swamp Spirit': '沼泽精灵',
    Treant: '树人',
    Vampire: '吸血鬼',
    Werewolf: '狼人',
    Xenohorror: '异形恐魔',
    Xenostalker: '异星潜猎者',
    Zombie: '僵尸'
  };

  const anatomy = {
    Head: '头',
    Body: '身体',
    Arm: '手臂',
    Leg: '腿',
    Wing: '翅膀',
    Cuirass: '胸甲',
    Helmet: '头盔'
  };

  const items = {
    "Adam's Apple": '亚当之喉',
    Annihilator: '歼灭炮',
    'Antimatter Generator': '反物质发生器',
    Armor: '盔甲',
    Axe: '斧头',
    Boot: '靴子',
    Beehive: '蜂巢',
    Blaster: '爆能枪',
    'Boar Mask': '野猪面具',
    Bomb: '炸弹',
    Boulder: '巨石',
    'Braineating Larva': '食脑幼虫',
    'Burning Branches': '燃烧的树枝',
    Chainsaw: '链锯',
    Cloak: '斗篷',
    Crossbow: '弩',
    Dart: '飞镖',
    Devastator: '毁灭者',
    Diadem: '冠冕',
    Disc: '圆盘刃',
    Djed: '杰德柱',
    'Double Axe': '双刃斧',
    Dreadstaff: '恐惧法杖',
    'Dual Lightsaber': '双刃光剑',
    'Explosive Acorns': '爆炸橡果',
    Flamethrower: '火焰喷射器',
    'Flaming Sword': '火焰剑',
    'Gatling Gun': '加特林机枪',
    Glaive: '长柄刀',
    'Gravitation Orb': '引力法球',
    'Grenade Launcher': '榴弹发射器',
    Hammer: '战锤',
    Helmet: '头盔',
    Horn: '号角',
    'Ice Sword': '冰剑',
    Kusarigama: '锁镰',
    Laser: '激光炮',
    Leeches: '水蛭',
    Mace: '钉头锤',
    'Machine Gun': '机枪',
    'Magic Hat': '魔法帽',
    'Magic Wand': '魔杖',
    Mortar: '迫击炮',
    "Pandora's Box": '潘多拉魔盒',
    Railgun: '轨道炮',
    'Raven Nest': '乌鸦巢',
    Rider: '骑手',
    'Rocket Launcher': '火箭发射器',
    Shield: '盾牌',
    Skull: '头骨',
    'Slave Brain': '奴隶大脑',
    'Slave Mask': '奴隶面具',
    'Spark Gap Tesla Coil': '火花隙特斯拉线圈',
    Spear: '长矛',
    Staff: '法杖',
    'Steam Gun': '蒸汽枪',
    'Steam Saw': '蒸汽锯',
    'Steel Claws': '钢爪',
    'Steel Feathers': '钢铁羽毛',
    Sword: '剑',
    Tesseract: '超立方体',
    "Thor's Hammer": '雷神之锤',
    Thorns: '荆棘',
    Totem: '图腾',
    'Triple Morning Star': '三连流星锤',
    'Uprooted Tree': '连根拔起的树',
    Whip: '鞭子',
    Wings: '翅膀',
    'Wings Torn Off': '被扯掉的翅膀',
    'Wyrm Hole': '巨龙之洞',
    'Book of Ice': '冰之书',
    'Book of Lightning': '闪电之书',
    'Book of Nightmares': '噩梦之书',
    'Book of Fire': '火焰之书',
    'Book of Poison': '毒之书',
    'Wolf Skin': '狼皮'
  };

  // 精确词条优先，便于覆盖专有译名或逐步修订术语。
  const exact = {
    'Skeleton Head': '骷髅头',
    'Skeleton Head with Magic Hat': '带魔法帽的骷髅头',
    'Skeleton Leg with Boot': '穿靴子的骷髅腿',
    'Pharaoh Mummy Head': '法老木乃伊头',
    'Female Mantis Body': '雌性螳螂人身体',
    'Fairy Body with Wings Torn Off': '失去翅膀的妖精身体'
  };

  function translateItem(value) {
    const normalized = value.trim().replace(/^(a|an|the)\s+/i, '');
    if (items[normalized]) return items[normalized];
    const book = normalized.match(/^Book of (.+)$/i);
    if (book) return `${items[book[1]] || book[1]}之书`;
    if (normalized.includes(' and ')) {
      return normalized.split(' and ').map(translateItem).join('和');
    }
    return items[normalized] || normalized;
  }

  function translateOne(value) {
    const source = value.trim();
    if (!source) return source;
    if (exact[source]) return exact[source];

    const inSkin = source.match(/^(.+?)\s+(Head|Body|Arm|Leg|Wing) in (.+)$/);
    if (inSkin) {
      const [, creature, part, clothing] = inSkin;
      const base = `${species[creature] || creature}${anatomy[part]}`;
      return `穿着${translateItem(clothing)}的${base}`;
    }

    const withItem = source.match(/^(.+?)\s+(Head|Body|Arm|Leg|Wing|Cuirass|Helmet) with (.+)$/);
    if (withItem) {
      const [, creature, part, attachment] = withItem;
      const base = `${species[creature] || creature}${anatomy[part]}`;
      const item = translateItem(attachment.replace(/^(a|an|the)\s+/i, ''));
      if (part === 'Arm') return `装备${item}的${base}`;
      if (part === 'Leg') return `穿${item}的${base}`;
      if (part === 'Body' && /^(Armor|Cloak)( and |$)/.test(attachment)) return `穿着${item}的${base}`;
      return `带${item}的${base}`;
    }

    const doubledHead = source.match(/^(.+?) Head (Double|Triple)$/);
    if (doubledHead) return `${doubledHead[2] === 'Double' ? '双头' : '三头'}${species[doubledHead[1]] || doubledHead[1]}`;

    const basicPart = source.match(/^(.+?) (Head|Body|Arm|Leg|Wing|Cuirass|Helmet)$/);
    if (basicPart) {
      const [, creature, part] = basicPart;
      return `${species[creature] || creature}${anatomy[part]}`;
    }

    return items[source] || source;
  }

  function translate(value) {
    return String(value ?? '').split('/').map(translateOne).join(' / ');
  }

  return { species, anatomy, items, exact, translate };
})();
