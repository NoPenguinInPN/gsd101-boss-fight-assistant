const state = {
  language: "en",
  initialized: false,
  phase: "setup",
  playerCount: 0,
  initialBossHp: 0,
  bossHp: 0,
  bossTurnDamage: 0,
  turnCount: 0,
  roundCount: 1,
  currentPlayerIndex: 0,
  effects: [],
  playerEffects: [],
  bossStatuses: [],
  fightActionCount: 0,
  roundUsedSkillIds: [],
  forceNextSkillUse: false,
  unlockedSkills: [],
  currentSkill: null,
  currentSkillResult: null,
  defeatCgDismissed: false,
  skillAnnouncementTitleKey: "boss_skills",
  skillAnnouncementSkills: [],
  logEntries: [],
};

const skillLibrary = [
  {
    id: "shadow_rend",
    tier: 1,
    name: { en: "Shadow Rend", zh: "暗影撕咬" },
    description: { en: "The boss dives in and tears at the battlefield.", zh: "Boss 俯冲撕扯，像要把战场撕开。" },
    effect: {
      en: "50% chance to deal 2 damage to the current player, 40% chance to deal 4 damage, and 10% chance to deal 7 damage.",
      zh: "对当前回合玩家 50% 几率造成 2 点伤害，40% 几率造成 4 点伤害，10% 几率造成 7 点伤害。",
    },
  },
  {
    id: "dread_gaze",
    tier: 2,
    name: { en: "Dread Gaze", zh: "恐惧凝视" },
    description: { en: "The boss locks onto a player and raises the pressure instantly.", zh: "Boss 锁定一名玩家，压迫感陡然上升。" },
    effect: {
      en: "Flip the current player over. They skip their next turn.",
      zh: "当前回合玩家翻面，跳过下个回合。",
    },
  },
  {
    id: "corrupt_breath",
    tier: 1,
    name: { en: "Corrupt Breath", zh: "腐化吐息" },
    description: { en: "The boss exhales dark mist and leaves poison behind.", zh: "Boss 喷出黑雾，造成持续中毒。" },
    effect: {
      en: "The current player has a 50% chance to lose 1 HP on each of their turns for 1 round.",
      zh: "当前回合玩家在接下来一轮中，每回合有 50% 几率失去 1 点体力。",
    },
  },
  {
    id: "bonebreaker_slam",
    tier: 1,
    name: { en: "Bonebreaker Slam", zh: "碎骨重击" },
    description: { en: "The boss smashes the ground like another strike is coming next.", zh: "Boss 重砸地面，下一秒像要继续追击。" },
    effect: {
      en: "Deal 3 damage to the current player. If their HP is 5 or lower, deal 5 instead. This app defaults to 3.",
      zh: "对当前回合玩家造成 3 点伤害；若当前玩家血量不大于 5，则改为 5 点。本程序默认按 3 点处理。",
    },
  },
  {
    id: "crimson_echo",
    tier: 2,
    name: { en: "Crimson Echo", zh: "血色回响" },
    description: { en: "A low pulse from the boss fills the air with danger.", zh: "Boss 发出低鸣，空气里都是危险。" },
    effect: {
      en: "Deal 1 damage to all players.",
      zh: "对所有玩家造成 1 点伤害。",
    },
  },
  {
    id: "calamity_trap",
    tier: 2,
    name: { en: "Calamity Trap", zh: "灾厄陷阱" },
    description: { en: "The boss refuses to attack directly and instead taunts the opponent.", zh: "Boss 并没有主动攻击，反而在挑衅对手。" },
    effect: {
      en: "The boss ignores all instant effects this turn and deals 1 damage. If the block succeeds, it deals 1 extra damage and heals 1 HP.",
      zh: "Boss 免疫此回合受到的单次效果并对玩家造成 1 点伤害；若免疫成功，对玩家额外造成 1 点伤害并回复 1 点体力。",
    },
  },
  {
    id: "unspeakable",
    tier: 3,
    name: { en: "Unspeakable", zh: "不可名状" },
    description: { en: "The boss releases eldritch energy and sends everyone into panic.", zh: "Boss 释放诡异能量，所有玩家陷入恐慌。" },
    effect: {
      en: "All damage the boss takes is reduced by 1, including instant and ongoing damage, for 1 round.",
      zh: "Boss 每次受到的伤害 -1，包括单次和持续效果，持续一轮。",
    },
  },
  {
    id: "beyond_time",
    tier: 3,
    name: { en: "Beyond Time", zh: "无往无前" },
    description: {
      en: "The boss enters a trance. It has no past and no future.",
      zh: "Boss 进入冥想状态，他没有过去，没有未来。",
    },
    effect: {
      en: "Remove all current boss statuses.",
      zh: "Boss 清除自身所有状态。",
    },
  },
  {
    id: "coiled_wait",
    tier: 1,
    name: { en: "Dormant Charge", zh: "蛰伏待机" },
    description: { en: "The boss crouches in silence, ready to spring at any moment.", zh: "Boss 进入蓄力状态，随时都要扑越上来。" },
    effect: {
      en: "The boss's next damage gains +X, where X is the current number of Dormant Charge stacks.",
      zh: "Boss 造成的下一次伤害 +X，其中 X 为当前蛰伏待机的次数。",
    },
  },
  {
    id: "endless_malice",
    tier: 4,
    name: { en: "Endless Malice", zh: "无尽恶意" },
    description: { en: "The boss releases its ultimate power.", zh: "Boss 释放出终极力量。" },
    effect: {
      en: "All damage the boss deals from now on gains +1.",
      zh: "Boss 接下来造成的所有伤害数值额外 +1。",
    },
    isUltimate: true,
  },
];

const musicPlaylists = {
  setupGather: [
    "./music/Normal%20Days.m4a",
    "./music/Execution%20Or%20Exile.m4a",
    "./music/KRay%20Mist.m4a",
    "./music/Flowing%20Beats.m4a",
    "./music/A%20Sad%20Stop.m4a",
    "./music/Iron%20Crocodile.m4a",
    "./music/Hox%20Rex%20Mix.m4a",
    "./music/Cyan%20Eye.m4a",
    "./music/Purple%20Wind.m4a",
    "./music/Fairy%20Fart.m4a",
    "./music/Miss%20At%20Eight%20To%20Four.m4a",
    "./music/Hate%20At%20Five%20Pass%20Five.m4a",
  ],
  fight: [
    "./music/Game%20Master.m4a",
    "./music/Five%20Seconds%20To%20Battle.m4a",
    "./music/Killing%20Toy.m4a",
    "./music/Anti-Player.m4a",
  ],
};

const musicState = {
  playlistKey: null,
  trackIndex: 0,
  hasInteracted: false,
  enabled: true,
};

const musicPlayer = new Audio();
musicPlayer.preload = "auto";
musicPlayer.volume = 0.62;

const normalAttackSkill = {
  id: "normal_attack",
  name: { en: "Normal Attack", zh: "普通攻击" },
  description: {
    en: "The boss lashes out with a basic strike.",
    zh: "Boss 发起一次普通攻击。",
  },
  effect: {
    en: "Deal 1 damage to the current player.",
    zh: "对当前回合玩家造成 1 点伤害。",
  },
};

const translations = {
  en: {
    app_title: "Boss Fight Assistant",
    close: "Close",
    setup_title: "Initialize Battle",
    player_count: "Player Count",
    initial_hp: "Boss Starting HP",
    initial_skill_count: "Starting Skill Count",
    enter_resource: "Enter Resource Phase",
    resource_phase: "Resource Phase",
    current_acting_player: "Current Acting Player",
    current_round: "Current Round",
    total_turns: "Total Turns",
    end_current_turn: "End Current Player Turn",
    enter_boss_fight: "Enter Boss Fight",
    skill_library: "Skill Library",
    battle_log: "Battle Log",
    instant_effect: "Instant Effect",
    deal_damage: "Deal Damage",
    heal_boss: "Heal Boss",
    ongoing_effect_turn: "Ongoing Effect / Turn",
    ongoing_damage: "Ongoing Damage",
    ongoing_heal: "Ongoing Heal",
    effect_turns: "Effect Turns",
    note: "Note",
    note_placeholder: "For example: bleed, curse, burn, armor break",
    acting_player_placeholder: "For example: Player 1 / Alice",
    resolve_action: "Resolve Action",
    awaiting_skill: "Awaiting Skill",
    phase: "Phase",
    boss_fight: "Boss Fight",
    current_player: "Current Player",
    ongoing_effects: "Ongoing Effects",
    quick_adjust: "Quick Adjust",
    boss_hp: "Boss HP",
    boss_turn_damage: "Boss Damage",
    boss_minus_1: "Boss -1 HP",
    boss_plus_1: "Boss +1 HP",
    boss_skills: "Boss Skills",
    boss_current_skills: "Boss Current Skills",
    boss_new_skill: "Boss Learned a New Skill",
    no_skills: "No skills yet.",
    no_effects: "No ongoing effects.",
    no_player_effects: "No player effects.",
    boss_defeated: "BOSS DEFEATED",
    language: "Language",
    bgm_on: "BGM On",
    bgm_off: "BGM Off",
    player_effects: "Player Effects",
    player_effect_turns_label: "{turns} round(s) left",
    boss_status_turns_label: "{turns} turn(s) left",
    boss_label: "Boss",
    player_status_skip_short: "Skip next turn",
    player_status_poison_short: "50% chance to lose 1 HP each turn",
    player_n: "Player {n}",
    init_complete: "Initialized: {playerCount} players, Boss starting HP {initialHp}.",
    gather_turn_complete: "{player} completed a resource turn. Boss HP +1.",
    boss_fight_start: "Boss Fight begins. Boss HP is now {bossHp}.",
    auto_resolve_damage: "{source}'s ongoing effect resolved: {amount} damage. {remaining}",
    auto_resolve_heal: "{source}'s ongoing effect resolved: heal {amount}. {remaining}",
    remaining_turns: "{count} turns remaining.",
    effect_ended: "Effect ended.",
    auto_total_damage: "Ongoing effects resolved automatically: {amount} total damage this turn.",
    auto_total_heal: "Ongoing effects resolved automatically: Boss healed {amount} this turn.",
    auto_total_zero: "Ongoing effects resolved automatically: net change 0 this turn.",
    invalid_nonnegative: "Invalid input: values cannot be negative.",
    action_prefix: "{player} acts:",
    instant_damage_summary: "deals {amount} instant damage.",
    instant_heal_summary: "heals Boss for {amount}.",
    dot_damage_summary: "deals {amount} ongoing damage now and continues for {turns} more turns.",
    dot_heal_summary: "heals Boss for {amount} now and continues for {turns} more turns.",
    no_direct_change: "no direct change to Boss HP this action.",
    note_summary: "Note: {note}.",
    skill_summary: "Boss skill: {skill}.",
    effect_label_damage: "{amount} damage each future turn, {turns} turns left",
    effect_label_heal: "{amount} heal each future turn, {turns} turns left",
    effect_label_generic: "{label}. {turns}",
    invalid_player_count: "Please enter a valid player count.",
    invalid_initial_hp: "Please enter a valid starting Boss HP.",
    invalid_initial_skill_count: "Please enter a valid starting skill count.",
    manual_boss_minus: "Manual adjust: Boss HP -1.",
    manual_boss_plus: "Manual adjust: Boss HP +1.",
    boss_turn_summary: "Boss turn: {summary}",
    normal_attack_summary: "{player} takes {amount} damage from a normal attack.",
    boss_damage_player: "{player} takes {amount} damage.",
    boss_damage_all_players: "All players take {amount} damage.",
    boss_damage_zero: "{player} takes 0 damage.",
    boss_skip_next_turn: "{player} will skip their next turn.",
    boss_poison_round: "{player} is poisoned: each of their turns has a 50% chance to lose 1 HP for 1 round.",
    boss_instant_block: "The boss ignores instant effects on the next player action.",
    boss_clear_status: "The boss clears all current statuses.",
    boss_next_double: "The boss's next damage gains +X from Dormant Charge.",
    boss_damage_plus: "The boss's future damage gains +1.",
    boss_poison_trigger_hit: "{player}'s poison triggers for {amount} damage. {remaining}",
    boss_poison_trigger_miss: "{player}'s poison triggers for 0 damage. {remaining}",
    player_skip_trigger: "{player} skips this turn. {remaining}",
    boss_reduction_trigger: "Boss damage reduction remains active. {remaining}",
    boss_instant_blocked_action: "Boss instant immunity blocks the player's instant effect.",
    boss_instant_block_bonus: "The trap is triggered: {player} takes 1 extra damage and the boss heals 1 HP.",
    turn_skipped_banner: "Turn Skipped",
    turn_skipped_desc: "This player loses their action because of a boss effect.",
    boss_status_reduction: "Reduce all incoming damage by 1",
    boss_status_next_double: "Next damage +X",
    boss_status_instant_immunity: "Ignore instant effects this turn",
    boss_status_damage_plus: "Future damage +1",
    boss_status_turn_used: "Used this round",
    transition_word_one: "Ready",
    transition_word_two: "to",
    transition_word_three: "die?",
  },
  zh: {
    app_title: "Boss Fight Assistant",
    close: "关闭",
    setup_title: "初始化战局",
    player_count: "玩家数量",
    initial_hp: "Boss 初始血量",
    initial_skill_count: "初始技能数",
    enter_resource: "进入资源收集",
    resource_phase: "资源收集阶段",
    current_acting_player: "当前行动玩家",
    current_round: "当前轮次",
    total_turns: "总回合数",
    end_current_turn: "结束当前玩家回合",
    enter_boss_fight: "进入 Boss Fight",
    skill_library: "技能库",
    battle_log: "战斗日志",
    instant_effect: "单次效果",
    deal_damage: "造成伤害",
    heal_boss: "回复血量",
    ongoing_effect_turn: "持续效果 / 回合",
    ongoing_damage: "持续伤害",
    ongoing_heal: "持续回复",
    effect_turns: "持续回合数",
    note: "备注",
    note_placeholder: "例如：流血、诅咒、燃烧、破甲",
    acting_player_placeholder: "例如：玩家 1 / Alice",
    resolve_action: "结算本次行动",
    awaiting_skill: "等待技能释放",
    phase: "阶段",
    boss_fight: "Boss Fight",
    current_player: "当前玩家",
    ongoing_effects: "持续效果",
    quick_adjust: "快速调整",
    boss_hp: "Boss HP",
    boss_turn_damage: "Boss 伤害",
    boss_minus_1: "Boss -1 HP",
    boss_plus_1: "Boss +1 HP",
    boss_skills: "Boss 技能",
    boss_current_skills: "Boss 当前技能",
    boss_new_skill: "Boss 获得新技能",
    no_skills: "目前没有技能。",
    no_effects: "目前没有持续效果。",
    no_player_effects: "目前没有玩家效果。",
    boss_defeated: "BOSS DEFEATED",
    language: "语言",
    bgm_on: "BGM 开",
    bgm_off: "BGM 关",
    player_effects: "玩家效果",
    player_effect_turns_label: "剩余 {turns} 轮",
    boss_status_turns_label: "剩余 {turns} 回合",
    boss_label: "Boss",
    player_status_skip_short: "跳过下个回合",
    player_status_poison_short: "每回合 50% 几率失去 1 点体力",
    player_n: "玩家 {n}",
    init_complete: "初始化完成：{playerCount} 名玩家，Boss 初始 HP 为 {initialHp}。",
    gather_turn_complete: "{player} 完成资源回合，Boss HP +1。",
    boss_fight_start: "Boss Fight 开始。Boss 当前 HP 为 {bossHp}。",
    auto_resolve_damage: "{source} 的持续效果已结算：自动结算 {amount} 点持续伤害。{remaining}",
    auto_resolve_heal: "{source} 的持续效果已结算：自动结算 {amount} 点持续回复。{remaining}",
    remaining_turns: "剩余 {count} 轮。",
    effect_ended: "效果结束。",
    auto_total_damage: "持续效果自动结算：本轮总共造成 {amount} 点伤害。",
    auto_total_heal: "持续效果自动结算：本轮总共为 Boss 回复 {amount} 点血量。",
    auto_total_zero: "持续效果自动结算：本轮净变化为 0。",
    invalid_nonnegative: "输入无效：数值不能为负数。",
    action_prefix: "{player} 行动：",
    instant_damage_summary: "造成 {amount} 点单次伤害。",
    instant_heal_summary: "为 Boss 回复 {amount} 点血量。",
    dot_damage_summary: "造成 {amount} 点持续伤害，并在后续 {turns} 回合继续结算。",
    dot_heal_summary: "为 Boss 回复 {amount} 点持续效果，并在后续 {turns} 回合继续结算。",
    no_direct_change: "本次未直接改动 Boss HP。",
    note_summary: "备注：{note}。",
    skill_summary: "Boss 技能：{skill}。",
    effect_label_damage: "后续每回合 {amount} 伤害，剩余 {turns} 回合",
    effect_label_heal: "后续每回合 {amount} 回复，剩余 {turns} 回合",
    effect_label_generic: "{label}。{turns}",
    invalid_player_count: "请输入有效的玩家数量。",
    invalid_initial_hp: "请输入有效的 Boss 初始血量。",
    invalid_initial_skill_count: "请输入有效的初始技能数。",
    manual_boss_minus: "手动调整：Boss HP -1。",
    manual_boss_plus: "手动调整：Boss HP +1。",
    boss_turn_summary: "Boss 回合：{summary}",
    normal_attack_summary: "普通攻击命中，{player} 受到 {amount} 点伤害。",
    boss_damage_player: "{player} 受到 {amount} 点伤害。",
    boss_damage_all_players: "所有玩家受到 {amount} 点伤害。",
    boss_damage_zero: "{player} 受到 0 点伤害。",
    boss_skip_next_turn: "{player} 将跳过下一个回合。",
    boss_poison_round: "{player} 陷入中毒：在接下来一轮中，该玩家每回合有 50% 几率失去 1 点体力。",
    boss_instant_block: "Boss 会在下一名玩家行动时免疫单次效果。",
    boss_clear_status: "Boss 清除了自身所有状态。",
    boss_next_double: "Boss 的下一次伤害获得来自蛰伏待机的 +X。",
    boss_damage_plus: "Boss 后续造成的伤害额外 +1。",
    boss_poison_trigger_hit: "{player} 的中毒触发，造成 {amount} 点伤害。{remaining}",
    boss_poison_trigger_miss: "{player} 的中毒触发，但造成 0 点伤害。{remaining}",
    player_skip_trigger: "{player} 跳过本回合。{remaining}",
    boss_reduction_trigger: "Boss 的减伤仍在生效。{remaining}",
    boss_instant_blocked_action: "Boss 的单次免疫挡下了玩家的单次效果。",
    boss_instant_block_bonus: "陷阱触发：{player} 额外受到 1 点伤害，Boss 回复 1 点体力。",
    turn_skipped_banner: "回合跳过",
    turn_skipped_desc: "该玩家受到 Boss 效果影响，本回合无法行动。",
    boss_status_reduction: "所有受到的伤害 -1",
    boss_status_next_double: "下一次伤害 +X",
    boss_status_instant_immunity: "本回合免疫单次效果",
    boss_status_damage_plus: "后续伤害 +1",
    boss_status_turn_used: "本轮已使用",
    transition_word_one: "为何",
    transition_word_two: "急于",
    transition_word_three: "求死？",
  },
};

const els = {
  screens: document.querySelectorAll(".screen"),
  setupForm: document.getElementById("setupForm"),
  playerCount: document.getElementById("playerCount"),
  initialHp: document.getElementById("initialHp"),
  initialSkillCount: document.getElementById("initialSkillCount"),
  bossHp: document.getElementById("bossHp"),
  fightBossHp: document.getElementById("fightBossHp"),
  roundCount: document.getElementById("roundCount"),
  turnCount: document.getElementById("turnCount"),
  phaseLabel: document.getElementById("phaseLabel"),
  currentPlayer: document.getElementById("currentPlayer"),
  effectCount: document.getElementById("effectCount"),
  gatherPlayerLabel: document.getElementById("gatherPlayerLabel"),
  endTurnBtn: document.getElementById("endTurnBtn"),
  startFightBtn: document.getElementById("startFightBtn"),
  gatherSkillToggleBtn: document.getElementById("gatherSkillToggleBtn"),
  battleForm: document.getElementById("battleForm"),
  actingPlayer: document.getElementById("actingPlayer"),
  instantEffectType: document.getElementById("instantEffectType"),
  instantDamage: document.getElementById("instantDamage"),
  dotEffectType: document.getElementById("dotEffectType"),
  dotDamage: document.getElementById("dotDamage"),
  dotTurns: document.getElementById("dotTurns"),
  actionNote: document.getElementById("actionNote"),
  applyBattleBtn: document.getElementById("applyBattleBtn"),
  bossDamageBtn: document.getElementById("bossDamageBtn"),
  bossHealBtn: document.getElementById("bossHealBtn"),
  effectsList: document.getElementById("effectsList"),
  log: document.getElementById("log"),
  bossAvatar: document.getElementById("bossAvatar"),
  logToggleBtn: document.getElementById("logToggleBtn"),
  logModal: document.getElementById("logModal"),
  logBackdrop: document.getElementById("logBackdrop"),
  logCloseBtn: document.getElementById("logCloseBtn"),
  skillToggleBtn: document.getElementById("skillToggleBtn"),
  skillModal: document.getElementById("skillModal"),
  skillBackdrop: document.getElementById("skillBackdrop"),
  skillCloseBtn: document.getElementById("skillCloseBtn"),
  skillList: document.getElementById("skillList"),
  skillAnnouncement: document.getElementById("skillAnnouncement"),
  skillAnnouncementBackdrop: document.getElementById("skillAnnouncementBackdrop"),
  skillAnnouncementCloseBtn: document.getElementById("skillAnnouncementCloseBtn"),
  skillAnnouncementTitle: document.getElementById("skillAnnouncementTitle"),
  skillAnnouncementList: document.getElementById("skillAnnouncementList"),
  transitionOverlay: document.getElementById("transitionOverlay"),
  transitionWordOne: document.getElementById("transitionWordOne"),
  transitionWordTwo: document.getElementById("transitionWordTwo"),
  transitionWordThree: document.getElementById("transitionWordThree"),
  currentSkillName: document.getElementById("currentSkillName"),
  currentSkillDesc: document.getElementById("currentSkillDesc"),
  skillBanner: document.getElementById("skillBanner"),
  defeatCg: document.getElementById("defeatCg"),
  defeatCloseBtn: document.getElementById("defeatCloseBtn"),
  setupTitle: document.getElementById("setupTitle"),
  playerCountLabel: document.getElementById("playerCountLabel"),
  initialHpLabel: document.getElementById("initialHpLabel"),
  initialSkillCountLabel: document.getElementById("initialSkillCountLabel"),
  enterGatherBtn: document.getElementById("enterGatherBtn"),
  gatherTitle: document.getElementById("gatherTitle"),
  gatherCurrentPlayerText: document.getElementById("gatherCurrentPlayerText"),
  roundCountLabel: document.getElementById("roundCountLabel"),
  turnCountLabel: document.getElementById("turnCountLabel"),
  bossHpLabelTop: document.getElementById("bossHpLabelTop"),
  fightBossHpLabel: document.getElementById("fightBossHpLabel"),
  bossTurnDamageLabel: document.getElementById("bossTurnDamageLabel"),
  bossTurnDamageDisplay: document.getElementById("bossTurnDamageDisplay"),
  actingPlayerLabel: document.getElementById("actingPlayerLabel"),
  instantEffectLabel: document.getElementById("instantEffectLabel"),
  instantOptionDamage: document.getElementById("instantOptionDamage"),
  instantOptionHeal: document.getElementById("instantOptionHeal"),
  dotEffectLabel: document.getElementById("dotEffectLabel"),
  dotOptionDamage: document.getElementById("dotOptionDamage"),
  dotOptionHeal: document.getElementById("dotOptionHeal"),
  dotTurnsLabel: document.getElementById("dotTurnsLabel"),
  actionNoteLabel: document.getElementById("actionNoteLabel"),
  phaseChipLabel: document.getElementById("phaseChipLabel"),
  currentPlayerChipLabel: document.getElementById("currentPlayerChipLabel"),
  effectCountChipLabel: document.getElementById("effectCountChipLabel"),
  quickAdjustTitle: document.getElementById("quickAdjustTitle"),
  playerEffectsTitle: document.getElementById("playerEffectsTitle"),
  playerEffectsList: document.getElementById("playerEffectsList"),
  effectsPanelTitle: document.getElementById("effectsPanelTitle"),
  logTitle: document.getElementById("logTitle"),
  skillModalTitle: document.getElementById("skillModalTitle"),
  defeatTitle: document.getElementById("defeatTitle"),
  languageSwitch: document.getElementById("languageSwitch"),
  musicSwitch: document.getElementById("musicSwitch"),
  musicToggleBtn: document.getElementById("musicToggleBtn"),
  langButtons: document.querySelectorAll(".language-switch .lang-btn[data-lang]"),
};

function t(key, params = {}) {
  const template = translations[state.language][key] ?? translations.en[key] ?? key;
  return template.replace(/\{(\w+)\}/g, (_, token) => String(params[token] ?? ""));
}

function getSkillName(skill) {
  return skill?.name?.[state.language] ?? skill?.name?.en ?? "";
}

function getSkillDescription(skill) {
  return skill?.description?.[state.language] ?? skill?.description?.en ?? "";
}

function getSkillEffectText(skill) {
  return skill?.effect?.[state.language] ?? skill?.effect?.en ?? "";
}

function getPlaylistTracks() {
  return musicPlaylists[musicState.playlistKey] ?? [];
}

function playCurrentTrack() {
  if (!musicState.enabled) {
    return;
  }

  const tracks = getPlaylistTracks();
  if (tracks.length === 0) {
    return;
  }

  const nextSrc = tracks[musicState.trackIndex];
  const resolvedSrc = new URL(nextSrc, window.location.href).href;
  if (musicPlayer.src !== resolvedSrc) {
    musicPlayer.src = nextSrc;
  }

  const playPromise = musicPlayer.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch(() => {});
  }
}

function setMusicPlaylist(playlistKey, { restart = false } = {}) {
  if (!musicState.enabled) {
    return;
  }

  if (!restart && musicState.playlistKey === playlistKey) {
    playCurrentTrack();
    return;
  }

  musicState.playlistKey = playlistKey;
  musicState.trackIndex = 0;
  playCurrentTrack();
}

function advancePlaylistTrack() {
  const tracks = getPlaylistTracks();
  if (tracks.length === 0) {
    return;
  }

  musicState.trackIndex = (musicState.trackIndex + 1) % tracks.length;
  playCurrentTrack();
}

function syncMusicToPhase() {
  if (state.phase === "fight") {
    setMusicPlaylist("fight");
    return;
  }

  setMusicPlaylist("setupGather");
}

function renderMusicToggle() {
  els.musicToggleBtn.textContent = musicState.enabled ? t("bgm_on") : t("bgm_off");
  els.musicToggleBtn.classList.toggle("active", musicState.enabled);
}

function toggleMusicEnabled() {
  musicState.enabled = !musicState.enabled;

  if (!musicState.enabled) {
    musicPlayer.pause();
  } else if (musicState.hasInteracted) {
    syncMusicToPhase();
  }

  renderMusicToggle();
}

function isAutoPlayerLabel(value) {
  return /^Player \d+$/.test(value) || /^玩家 \d+$/.test(value);
}

function setLanguage(language) {
  const shouldSyncActingPlayer = isAutoPlayerLabel(els.actingPlayer.value.trim());
  state.language = language;
  document.documentElement.lang = language === "en" ? "en" : "zh-CN";
  document.title = t("app_title");
  renderLanguageSwitch();
  renderMusicToggle();
  applyStaticTranslations();
  updateUI();
  renderLog();

  if (shouldSyncActingPlayer) {
    els.actingPlayer.value = getCurrentPlayerLabel();
  }

  if (!els.skillModal.classList.contains("hidden")) {
    renderSkills();
  }

  if (!els.skillAnnouncement.classList.contains("hidden")) {
    els.skillAnnouncementTitle.textContent = t(state.skillAnnouncementTitleKey);
    renderSkillItems(els.skillAnnouncementList, state.skillAnnouncementSkills, t("no_skills"));
  }
}

function renderLanguageSwitch() {
  els.langButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === state.language);
  });
}

function applyStaticTranslations() {
  els.setupTitle.textContent = t("setup_title");
  els.playerCountLabel.textContent = t("player_count");
  els.initialHpLabel.textContent = t("initial_hp");
  els.initialSkillCountLabel.textContent = t("initial_skill_count");
  els.enterGatherBtn.textContent = t("enter_resource");
  els.gatherTitle.textContent = t("resource_phase");
  els.gatherCurrentPlayerText.textContent = t("current_acting_player");
  els.bossHpLabelTop.textContent = t("boss_hp");
  els.fightBossHpLabel.textContent = t("boss_hp");
  els.bossTurnDamageLabel.textContent = t("boss_turn_damage");
  els.roundCountLabel.textContent = t("current_round");
  els.turnCountLabel.textContent = t("total_turns");
  els.endTurnBtn.textContent = t("end_current_turn");
  els.startFightBtn.textContent = t("enter_boss_fight");
  els.skillToggleBtn.textContent = t("skill_library");
  els.gatherSkillToggleBtn.textContent = t("skill_library");
  els.logToggleBtn.textContent = t("battle_log");
  els.actingPlayerLabel.textContent = t("current_acting_player");
  els.actingPlayer.placeholder = t("acting_player_placeholder");
  els.instantEffectLabel.textContent = t("instant_effect");
  els.instantOptionDamage.textContent = t("deal_damage");
  els.instantOptionHeal.textContent = t("heal_boss");
  els.dotEffectLabel.textContent = t("ongoing_effect_turn");
  els.dotOptionDamage.textContent = t("ongoing_damage");
  els.dotOptionHeal.textContent = t("ongoing_heal");
  els.dotTurnsLabel.textContent = t("effect_turns");
  els.actionNoteLabel.textContent = t("note");
  els.actionNote.placeholder = t("note_placeholder");
  els.applyBattleBtn.textContent = t("resolve_action");
  els.phaseChipLabel.textContent = t("phase");
  els.currentPlayerChipLabel.textContent = t("current_player");
  els.effectCountChipLabel.textContent = t("ongoing_effects");
  els.quickAdjustTitle.textContent = t("quick_adjust");
  els.playerEffectsTitle.textContent = t("player_effects");
  els.bossDamageBtn.textContent = t("boss_minus_1");
  els.bossHealBtn.textContent = t("boss_plus_1");
  els.effectsPanelTitle.textContent = t("ongoing_effects");
  els.logTitle.textContent = t("battle_log");
  els.skillModalTitle.textContent = t("boss_skills");
  els.skillAnnouncementTitle.textContent = t(state.skillAnnouncementTitleKey);
  els.skillCloseBtn.textContent = t("close");
  els.logCloseBtn.textContent = t("close");
  els.skillAnnouncementCloseBtn.textContent = t("close");
  els.defeatCloseBtn.textContent = t("close");
  els.defeatTitle.textContent = t("boss_defeated");
  els.transitionWordOne.textContent = t("transition_word_one");
  els.transitionWordTwo.textContent = t("transition_word_two");
  els.transitionWordThree.textContent = t("transition_word_three");
}

function switchScreen(screenId) {
  els.screens.forEach((screen) => {
    screen.classList.toggle("active", screen.id === screenId);
  });

  closeLogModal();
  closeSkillModal();
}

function getCurrentPlayerLabel() {
  if (!state.initialized) {
    return "-";
  }

  return t("player_n", { n: state.currentPlayerIndex + 1 });
}

function updateDefeatCg() {
  const shouldShow = state.phase === "fight" && state.bossHp === 0 && !state.defeatCgDismissed;
  els.defeatCg.classList.toggle("hidden", !shouldShow);
}

function updateUI() {
  const inFight = state.phase === "fight";
  const inGather = state.phase === "gather";

  els.bossHp.textContent = String(state.bossHp);
  els.fightBossHp.textContent = String(state.bossHp);
  els.bossTurnDamageDisplay.textContent = String(state.bossTurnDamage);
  els.roundCount.textContent = String(state.roundCount);
  els.turnCount.textContent = String(state.turnCount);
  els.currentPlayer.textContent = getCurrentPlayerLabel();
  els.gatherPlayerLabel.textContent = getCurrentPlayerLabel();
  els.effectCount.textContent = String(state.effects.length + state.playerEffects.length + state.bossStatuses.length);
  els.phaseLabel.textContent = inFight ? t("boss_fight") : inGather ? t("resource_phase") : t("setup_title");
  els.gatherSkillToggleBtn.textContent = t("skill_library");
  els.skillToggleBtn.textContent = t("skill_library");
  els.currentSkillName.textContent = state.currentSkill ? getSkillName(state.currentSkill) : t("awaiting_skill");
  els.currentSkillDesc.textContent = state.currentSkill
    ? state.currentSkillResult?.summary ?? getSkillDescription(state.currentSkill)
    : "";
  els.skillBanner.classList.toggle("ultimate-flare", Boolean(state.currentSkill?.isUltimate));

  els.endTurnBtn.disabled = !inGather;
  els.startFightBtn.disabled = !inGather || !state.initialized;
  els.applyBattleBtn.disabled = !inFight;
  els.bossDamageBtn.disabled = !inFight;
  els.bossHealBtn.disabled = !inFight;

  renderEffects();
  renderPlayerEffects();
  renderSkills();
  updateDefeatCg();
  updateEffectInputHints();
}

function playScreenTransition(phaseClass, nextScreenId, duration, switchRatio) {
  els.transitionOverlay.classList.remove("hidden", "phase-gather", "phase-fight");
  els.transitionOverlay.classList.add(phaseClass);

  window.setTimeout(() => {
    switchScreen(nextScreenId);
  }, Math.max(120, duration * switchRatio));

  window.setTimeout(() => {
    els.transitionOverlay.classList.add("hidden");
    els.transitionOverlay.classList.remove("phase-gather", "phase-fight");
  }, duration);
}

function pickRandomSkills(count) {
  const chosen = [];
  const limit = Math.max(0, Math.min(count, skillLibrary.length));

  while (chosen.length < limit) {
    const learnedIds = new Set(chosen.map((skill) => skill.id));
    const remaining = getLearnableSkills(learnedIds);
    if (remaining.length === 0) {
      break;
    }
    const index = Math.floor(Math.random() * remaining.length);
    chosen.push(remaining[index]);
  }

  return chosen;
}

function getLearnableSkills(learnedIds = new Set(state.unlockedSkills.map((skill) => skill.id))) {
  const tiers = [1, 2, 3, 4];

  for (const tier of tiers) {
    const tierSkills = skillLibrary.filter((skill) => skill.tier === tier);
    const unlockedTier = tier === 1 || skillLibrary.filter((skill) => skill.tier === tier - 1).every((skill) => learnedIds.has(skill.id));
    if (!unlockedTier) {
      return [];
    }

    const remaining = tierSkills.filter((skill) => !learnedIds.has(skill.id));
    if (remaining.length > 0) {
      return remaining;
    }
  }

  return [];
}

function learnRandomSkill() {
  const remaining = getLearnableSkills();

  if (remaining.length === 0) {
    return null;
  }

  const learned = remaining[Math.floor(Math.random() * remaining.length)];
  state.unlockedSkills.push(learned);
  if (learned.isUltimate) {
    state.forceNextSkillUse = true;
    triggerUltimateFlare();
  }
  openSkillAnnouncement("boss_new_skill", [learned]);
  return learned;
}

function useRandomUnlockedSkill() {
  const availableSkills = state.unlockedSkills.filter((skill) => !state.roundUsedSkillIds.includes(skill.id));

  if (availableSkills.length === 0) {
    state.currentSkill = normalAttackSkill;
    return normalAttackSkill;
  }

  const shouldUseSkill = state.forceNextSkillUse || Math.random() >= 0.5;
  if (!shouldUseSkill) {
    state.currentSkill = normalAttackSkill;
    return normalAttackSkill;
  }

  state.forceNextSkillUse = false;
  state.currentSkill = availableSkills[Math.floor(Math.random() * availableSkills.length)];
  state.roundUsedSkillIds.push(state.currentSkill.id);
  return state.currentSkill;
}

function initializeGame(playerCount, initialHp, initialSkillCount) {
  state.initialized = true;
  state.phase = "gather";
  state.playerCount = playerCount;
  state.initialBossHp = initialHp;
  state.bossHp = initialHp;
  state.bossTurnDamage = 0;
  state.turnCount = 0;
  state.roundCount = 1;
  state.currentPlayerIndex = 0;
  state.effects = [];
  state.playerEffects = [];
  state.bossStatuses = [];
  state.fightActionCount = 0;
  state.roundUsedSkillIds = [];
  state.unlockedSkills = pickRandomSkills(initialSkillCount);
  state.forceNextSkillUse = state.unlockedSkills.some((skill) => skill.id === "endless_malice");
  state.currentSkill = null;
  state.currentSkillResult = null;
  state.defeatCgDismissed = false;
  state.logEntries = [];

  els.actingPlayer.value = t("player_n", { n: 1 });
  els.instantEffectType.value = "damage";
  els.instantDamage.value = "0";
  els.dotEffectType.value = "damage";
  els.dotDamage.value = "0";
  els.dotTurns.value = "0";
  els.actionNote.value = "";
  renderLog();

  addLog({
    type: "i18n",
    key: "init_complete",
    params: { playerCount, initialHp },
  });
  syncMusicToPhase();
  updateUI();
  playScreenTransition("phase-gather", "gatherScreen", 3000, 0.42);
  window.setTimeout(() => {
    openSkillAnnouncement("boss_current_skills", state.unlockedSkills);
  }, 3000);
}

function advanceGatherTurn() {
  if (state.phase !== "gather") {
    return;
  }

  const finishedPlayer = getCurrentPlayerLabel();
  state.turnCount += 1;
  state.bossHp += 1;
  state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.playerCount;

  if (state.currentPlayerIndex === 0) {
    state.roundCount += 1;
    learnRandomSkill();
  }

  addLog({
    type: "i18n",
    key: "gather_turn_complete",
    params: { player: finishedPlayer },
  });
  updateUI();
}

function startFight() {
  if (state.phase !== "gather") {
    return;
  }

  setMusicPlaylist("fight", { restart: true });
  state.phase = "fight";
  state.currentPlayerIndex = 0;
  state.bossTurnDamage = 0;
  state.bossStatuses = [];
  state.playerEffects = [];
  state.roundUsedSkillIds = [];
  state.forceNextSkillUse = state.unlockedSkills.some((skill) => skill.id === "endless_malice");
  state.currentSkill = null;
  state.currentSkillResult = null;
  state.defeatCgDismissed = false;
  els.actingPlayer.value = t("player_n", { n: 1 });
  addLog({
    type: "i18n",
    key: "boss_fight_start",
    params: { bossHp: state.bossHp },
  });
  updateUI();
  playScreenTransition("phase-fight", "fightScreen", 15200, 0.9);
  window.setTimeout(() => {
    openSkillAnnouncement("boss_current_skills", state.unlockedSkills);
  }, 15200);
}

function updateEffectInputHints() {
  const instantType = els.instantEffectType.value;
  const dotType = els.dotEffectType.value;

  els.instantEffectType.classList.toggle("effect-damage", instantType === "damage");
  els.instantEffectType.classList.toggle("effect-heal", instantType === "heal");
  els.instantDamage.classList.toggle("effect-damage", instantType === "damage");
  els.instantDamage.classList.toggle("effect-heal", instantType === "heal");

  els.dotEffectType.classList.toggle("effect-damage", dotType === "damage");
  els.dotEffectType.classList.toggle("effect-heal", dotType === "heal");
  els.dotDamage.classList.toggle("effect-damage", dotType === "damage");
  els.dotDamage.classList.toggle("effect-heal", dotType === "heal");
}

function autoResolveEffects() {
  if (state.phase !== "fight" || state.effects.length === 0) {
    return;
  }

  const resolvingEffects = [...state.effects];
  let netDamage = 0;
  state.effects = resolvingEffects
    .map((effect) => ({
      ...effect,
      remainingTurns: effect.remainingTurns - 1,
    }))
    .filter((effect) => effect.remainingTurns > 0);

  resolvingEffects.forEach((effect) => {
    const actualAmount =
      effect.damage > 0 ? applyIncomingBossDamageReduction(effect.damage) : Math.abs(effect.damage);
    netDamage += effect.damage > 0 ? actualAmount : -actualAmount;
    addLog(
      {
        type: "effect-resolve",
        source: effect.source,
        amount: actualAmount,
        effectType: effect.damage > 0 ? "damage" : "heal",
        remainingTurns: Math.max(0, effect.remainingTurns - 1),
      },
    );
  });

  if (netDamage > 0) {
    state.bossHp = Math.max(0, state.bossHp - netDamage);
    if (state.bossHp === 0) {
      state.defeatCgDismissed = false;
    }
    triggerBossAnimation("hit");
    addLog({
      type: "i18n",
      key: "auto_total_damage",
      params: { amount: netDamage },
    });
  } else if (netDamage < 0) {
    state.bossHp += Math.abs(netDamage);
    triggerBossAnimation("heal");
    addLog({
      type: "i18n",
      key: "auto_total_heal",
      params: { amount: Math.abs(netDamage) },
    });
  } else {
    addLog({ type: "i18n", key: "auto_total_zero" });
  }
}

function getCurrentActingPlayerName() {
  return els.actingPlayer.value.trim() || getCurrentPlayerLabel();
}

function addPlayerStatus(status) {
  state.playerEffects.push({
    id: createId(),
    ...status,
  });
}

function addBossStatus(status) {
  state.bossStatuses.push({
    id: createId(),
    ...status,
  });
}

function countBossStatus(type) {
  return state.bossStatuses.filter((status) => status.type === type).length;
}

function applyIncomingBossDamageReduction(amount) {
  if (amount <= 0) {
    return 0;
  }

  const reduction = countBossStatus("damage_reduction_round");
  return Math.max(0, amount - reduction);
}

function clearBossStatuses() {
  state.effects = [];
  state.bossStatuses = [];
}

function getRemainingText(remaining) {
  return remaining > 0 ? t("remaining_turns", { count: remaining }) : t("effect_ended");
}

function calculateBossDamage(baseDamage) {
  if (baseDamage <= 0) {
    return 0;
  }

  const pendingCharge = countBossStatus("next_charge");
  const bonus = countBossStatus("damage_plus");
  const total = baseDamage + pendingCharge + bonus;

  if (pendingCharge > 0) {
    state.bossStatuses = state.bossStatuses.filter((status) => status.type !== "next_charge");
  }

  return total;
}

function resolveBossStatusesAtTurnStart() {
  if (state.bossStatuses.some((status) => status.type === "damage_reduction_round")) {
    const status = state.bossStatuses.find((item) => item.type === "damage_reduction_round");
    addLog({
      type: "i18n",
      key: "boss_reduction_trigger",
      params: {
        remaining: getRemainingText(Math.max(0, (status?.remainingTurns ?? 1) - 1)),
      },
    });
  }
}

function resolveCurrentPlayerStatuses() {
  const currentIndex = state.currentPlayerIndex;
  const currentPlayer = getCurrentActingPlayerName();
  let damage = 0;
  let skipTurn = false;
  const nextEffects = [];

  state.playerEffects.forEach((effect) => {
    if (effect.targetIndex !== currentIndex) {
      nextEffects.push(effect);
      return;
    }

    const remainingRounds = effect.remainingRounds - 1;

    if (effect.type === "poison_round") {
      const didHit = Math.random() < effect.chance;
      const dealt = didHit ? calculateBossDamage(effect.amount) : 0;
      damage += dealt;
      addLog({
        type: "i18n",
        key: didHit ? "boss_poison_trigger_hit" : "boss_poison_trigger_miss",
        params: {
          player: currentPlayer,
          amount: dealt,
          remaining: getRemainingText(remainingRounds),
        },
      });
    }

    if (effect.type === "skip_turn") {
      skipTurn = true;
      addLog({
        type: "i18n",
        key: "player_skip_trigger",
        params: {
          player: currentPlayer,
          remaining: getRemainingText(remainingRounds),
        },
      });
    }

    if (remainingRounds > 0) {
      nextEffects.push({
        ...effect,
        remainingRounds,
      });
    }
  });

  state.playerEffects = nextEffects;
  return { damage, skipTurn };
}

function getBossStatusLabel(status) {
  if (status.type === "damage_reduction_round") {
    return t("boss_status_reduction");
  }

  if (status.type === "next_charge") {
    return t("boss_status_next_double");
  }

  if (status.type === "instant_immunity") {
    return t("boss_status_instant_immunity");
  }

  if (status.type === "damage_plus") {
    return t("boss_status_damage_plus");
  }

  return "";
}

function getBossStatusText(status) {
  if (typeof status.remainingTurns === "number") {
    return t("effect_label_generic", {
      label: getBossStatusLabel(status),
      turns: t("boss_status_turns_label", { turns: status.remainingTurns }),
    });
  }

  return getBossStatusLabel(status);
}

function getBossStatusKind(status) {
  if (status.type === "damage_reduction_round" || status.type === "instant_immunity") {
    return "heal";
  }

  if (status.type === "next_charge" || status.type === "damage_plus") {
    return "damage";
  }

  return "";
}

function createSkillSummary(key, params) {
  return t(key, params);
}

function resolveBossSkill(skill) {
  const currentPlayer = getCurrentActingPlayerName();
  const currentIndex = state.currentPlayerIndex;
  const result = {
    damageToCurrentPlayer: 0,
    summary: "",
  };

  if (skill.isUltimate) {
    triggerUltimateFlare();
  }

  switch (skill.id) {
    case "shadow_rend": {
      const roll = Math.random();
      const baseDamage = roll < 0.5 ? 2 : roll < 0.9 ? 4 : 7;
      const damage = calculateBossDamage(baseDamage);
      result.damageToCurrentPlayer = damage;
      result.summary = createSkillSummary("boss_damage_player", { player: currentPlayer, amount: damage });
      break;
    }
    case "dread_gaze": {
      addPlayerStatus({
        type: "skip_turn",
        targetIndex: currentIndex,
        player: currentPlayer,
        remainingRounds: 1,
      });
      result.summary = createSkillSummary("boss_skip_next_turn", { player: currentPlayer });
      break;
    }
    case "corrupt_breath": {
      addPlayerStatus({
        type: "poison_round",
        targetIndex: currentIndex,
        player: currentPlayer,
        remainingRounds: 1,
        amount: 1,
        chance: 0.5,
      });
      result.summary = createSkillSummary("boss_poison_round", { player: currentPlayer });
      break;
    }
    case "bonebreaker_slam": {
      const damage = calculateBossDamage(3);
      result.damageToCurrentPlayer = damage;
      result.summary = createSkillSummary("boss_damage_player", { player: currentPlayer, amount: damage });
      break;
    }
    case "crimson_echo": {
      const damage = calculateBossDamage(1);
      result.damageToCurrentPlayer = damage;
      result.summary = createSkillSummary("boss_damage_all_players", { amount: damage });
      break;
    }
    case "calamity_trap": {
      addBossStatus({
        type: "instant_immunity",
        remainingTurns: 1,
        blockedExtraDamage: 1,
        healOnBlock: 1,
        justAdded: true,
      });
      const damage = calculateBossDamage(1);
      result.damageToCurrentPlayer = damage;
      result.summary = `${createSkillSummary("boss_instant_block", {})} ${createSkillSummary("boss_damage_player", {
        player: currentPlayer,
        amount: damage,
      })}`.trim();
      break;
    }
    case "unspeakable": {
      addBossStatus({
        type: "damage_reduction_round",
        remainingTurns: state.playerCount,
        justAdded: true,
      });
      result.summary = getSkillEffectText(skill);
      break;
    }
    case "beyond_time": {
      clearBossStatuses();
      result.summary = createSkillSummary("boss_clear_status", {});
      break;
    }
    case "dormant_charge": {
      addBossStatus({
        type: "next_charge",
      });
      result.summary = createSkillSummary("boss_next_double", {});
      break;
    }
    case "endless_malice": {
      addBossStatus({
        type: "damage_plus",
      });
      result.summary = createSkillSummary("boss_damage_plus", {});
      break;
    }
    default: {
      result.summary = createSkillSummary("boss_damage_zero", { player: currentPlayer });
      break;
    }
  }

  state.bossTurnDamage += result.damageToCurrentPlayer;
  addLog({
    type: "i18n",
    key: "boss_turn_summary",
    params: { summary: `${getSkillName(skill)}. ${result.summary}`.trim() },
  });
  return result;
}

function expireEndOfTurnBossStatuses() {
  state.bossStatuses = state.bossStatuses
    .map((status) => {
      if (status.justAdded) {
        return {
          ...status,
          justAdded: false,
        };
      }

      if (typeof status.remainingTurns === "number") {
        return {
          ...status,
          remainingTurns: status.remainingTurns - 1,
        };
      }

      return status;
    })
    .filter((status) => (typeof status.remainingTurns === "number" ? status.remainingTurns > 0 : true));
}

function advanceFightTurn() {
  state.fightActionCount += 1;
  state.currentPlayerIndex = state.fightActionCount % state.playerCount;
  if (state.currentPlayerIndex === 0) {
    state.roundCount += 1;
    state.roundUsedSkillIds = [];
    learnRandomSkill();
  }
  els.actingPlayer.value = t("player_n", { n: state.currentPlayerIndex + 1 });
}

function applyBattleAction(event) {
  event.preventDefault();
  if (state.phase !== "fight") {
    return;
  }

  const actingPlayer =
    els.actingPlayer.value.trim() || t("player_n", { n: ((state.fightActionCount % state.playerCount) || 0) + 1 });
  const instantType = els.instantEffectType.value;
  const instantDamage = Number(els.instantDamage.value) || 0;
  const dotType = els.dotEffectType.value;
  const dotDamage = Number(els.dotDamage.value) || 0;
  const dotTurns = Number(els.dotTurns.value) || 0;
  const note = els.actionNote.value.trim();

  if (instantDamage < 0 || dotDamage < 0 || dotTurns < 0) {
    addLog({ type: "i18n", key: "invalid_nonnegative" });
    return;
  }

  state.bossTurnDamage = 0;
  state.currentSkill = null;
  state.currentSkillResult = null;
  autoResolveEffects();
  resolveBossStatusesAtTurnStart();
  const playerStatusResult = resolveCurrentPlayerStatuses();
  state.bossTurnDamage += playerStatusResult.damage;

  let animation = "cast";
  let hasEffect = false;
  let instantAmount = 0;
  let dotAmount = 0;
  let dotTurnsApplied = 0;
  const instantBlockStatus = state.bossStatuses.find((status) => status.type === "instant_immunity" && !status.justAdded);

  if (!playerStatusResult.skipTurn) {
    if (instantDamage > 0) {
      if (instantBlockStatus) {
        addLog({ type: "i18n", key: "boss_instant_blocked_action" });
        const blockedDamage = calculateBossDamage(instantBlockStatus.blockedExtraDamage ?? 0);
        state.bossTurnDamage += blockedDamage;
        state.bossHp += instantBlockStatus.healOnBlock ?? 0;
        addLog({
          type: "i18n",
          key: "boss_instant_block_bonus",
          params: { player: actingPlayer },
        });
      } else if (instantType === "damage") {
        const appliedDamage = applyIncomingBossDamageReduction(instantDamage);
        state.bossHp = Math.max(0, state.bossHp - appliedDamage);
        if (state.bossHp === 0) {
          state.defeatCgDismissed = false;
        }
        instantAmount = appliedDamage;
        animation = appliedDamage > 0 ? "hit" : "cast";
        hasEffect = true;
      } else if (instantType === "heal") {
        state.bossHp += instantDamage;
        instantAmount = instantDamage;
        animation = "heal";
        hasEffect = true;
      }
    }

    if (dotDamage > 0 && dotTurns > 0) {
      const rawSignedDotValue = dotType === "damage" ? dotDamage : -dotDamage;
      const appliedSignedDotValue =
        rawSignedDotValue > 0 ? applyIncomingBossDamageReduction(rawSignedDotValue) : rawSignedDotValue;
      if (appliedSignedDotValue > 0) {
        state.bossHp = Math.max(0, state.bossHp - appliedSignedDotValue);
        if (state.bossHp === 0) {
          state.defeatCgDismissed = false;
        }
        animation = appliedSignedDotValue > 0 ? "hit" : animation;
      } else {
        state.bossHp += Math.abs(appliedSignedDotValue);
        animation = "heal";
      }

      if (dotTurns > 1) {
        state.effects.push({
          id: createId(),
          source: actingPlayer,
          damage: rawSignedDotValue,
          remainingTurns: dotTurns - 1,
          note: note,
          noteKey: note ? null : dotType === "damage" ? "ongoing_damage" : "ongoing_heal",
        });
      }
      dotAmount = Math.abs(appliedSignedDotValue);
      dotTurnsApplied = dotTurns;
      hasEffect = true;
    }
  }

  const bossSkill = useRandomUnlockedSkill();
  state.currentSkill = bossSkill;
  if (bossSkill.id === "normal_attack") {
    const damage = calculateBossDamage(1);
    state.bossTurnDamage += damage;
    state.currentSkillResult = {
      summary: t("normal_attack_summary", {
        player: actingPlayer,
        amount: damage,
      }),
    };
    addLog({
      type: "i18n",
      key: "boss_turn_summary",
      params: { summary: `${getSkillName(bossSkill)}. ${state.currentSkillResult.summary}` },
    });
  } else {
    state.currentSkillResult = resolveBossSkill(bossSkill);
  }
  triggerBossAnimation("cast");
  expireEndOfTurnBossStatuses();

  addLog({
    type: "action",
    actingPlayer,
    instantType,
    instantAmount,
    dotType,
    dotAmount,
    dotTurnsApplied,
    note,
    hasEffect,
    skill: bossSkill,
    skillSummary: state.currentSkillResult?.summary ?? "",
  });

  advanceFightTurn();
  els.instantEffectType.value = "damage";
  els.instantDamage.value = "0";
  els.dotEffectType.value = "damage";
  els.dotDamage.value = "0";
  els.dotTurns.value = "0";
  els.actionNote.value = "";
  updateUI();
}

function manualAdjustBoss(delta, animationType, logKey) {
  if (state.phase !== "fight") {
    return;
  }

  state.bossHp = Math.max(0, state.bossHp + delta);
  if (state.bossHp > 0) {
    state.defeatCgDismissed = false;
  } else {
    state.defeatCgDismissed = false;
  }
  triggerBossAnimation(animationType);
  addLog({ type: "i18n", key: logKey });
  updateUI();
}

function triggerBossAnimation(type) {
  els.bossAvatar.classList.remove("hit", "heal", "cast");
  void els.bossAvatar.offsetWidth;

  if (type) {
    els.bossAvatar.classList.add(type);
  }
}

function triggerUltimateFlare() {
  els.bossAvatar.classList.remove("ultimate-flare");
  els.skillBanner.classList.remove("ultimate-flare");
  void els.bossAvatar.offsetWidth;
  els.bossAvatar.classList.add("ultimate-flare");
  els.skillBanner.classList.add("ultimate-flare");
  window.setTimeout(() => {
    els.bossAvatar.classList.remove("ultimate-flare");
    els.skillBanner.classList.remove("ultimate-flare");
  }, 900);
}

function openLogModal() {
  closeSkillModal();
  els.logModal.classList.remove("hidden");
}

function closeLogModal() {
  els.logModal.classList.add("hidden");
}

function openSkillModal() {
  closeSkillAnnouncement();
  closeLogModal();
  els.skillModal.classList.remove("hidden");
}

function closeSkillModal() {
  els.skillModal.classList.add("hidden");
}

function openSkillAnnouncement(title, skills) {
  closeLogModal();
  closeSkillModal();
  state.skillAnnouncementTitleKey = title;
  state.skillAnnouncementSkills = [...skills];
  els.skillAnnouncementTitle.textContent = t(title);
  renderSkillItems(els.skillAnnouncementList, skills, t("no_skills"));
  els.skillAnnouncement.classList.remove("hidden");
}

function closeSkillAnnouncement() {
  state.skillAnnouncementSkills = [];
  els.skillAnnouncement.classList.add("hidden");
}

function createId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  return `effect-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function renderEffects() {
  const combinedEffects = [
    ...state.effects.map((effect) => ({ ...effect, displayType: "player" })),
    ...state.bossStatuses.map((effect) => ({ ...effect, displayType: "boss" })),
  ];

  if (combinedEffects.length === 0) {
    els.effectsList.className = "effects-list muted";
    els.effectsList.textContent = t("no_effects");
    return;
  }

  els.effectsList.className = "effects-list";
  els.effectsList.textContent = "";

  combinedEffects.forEach((effect) => {
    const item = document.createElement("div");
    item.className = "effect-item";

    const title = document.createElement("strong");
    title.textContent = effect.displayType === "boss" ? t("boss_label") : effect.source;

    const damageLine = document.createElement("div");
    if (effect.displayType === "boss") {
      const kind = getBossStatusKind(effect);
      if (kind) {
        item.classList.add(kind === "damage" ? "effect-item-damage" : "effect-item-heal");
      }
      damageLine.textContent = getBossStatusText(effect);
    } else {
      item.classList.add(effect.damage > 0 ? "effect-item-damage" : "effect-item-heal");
      damageLine.textContent =
        effect.damage > 0
          ? t("effect_label_damage", { amount: effect.damage, turns: effect.remainingTurns })
          : t("effect_label_heal", { amount: Math.abs(effect.damage), turns: effect.remainingTurns });
    }

    item.appendChild(title);
    item.appendChild(damageLine);
    if (effect.displayType !== "boss") {
      const noteLine = document.createElement("div");
      noteLine.textContent = effect.noteKey ? t(effect.noteKey) : effect.note;
      item.appendChild(noteLine);
    }
    els.effectsList.appendChild(item);
  });
}

function renderPlayerEffects() {
  if (state.playerEffects.length === 0) {
    els.playerEffectsList.className = "effects-list muted";
    els.playerEffectsList.textContent = t("no_player_effects");
    return;
  }

  els.playerEffectsList.className = "effects-list";
  els.playerEffectsList.textContent = "";

  state.playerEffects.forEach((effect) => {
    const item = document.createElement("div");
    item.className = "effect-item";
    if (effect.type === "poison_round") {
      item.classList.add("effect-item-damage");
    }

    const title = document.createElement("strong");
    title.textContent = effect.player;

    const effectLine = document.createElement("div");
    effectLine.textContent =
      effect.type === "skip_turn" ? t("player_status_skip_short") : t("player_status_poison_short");

    const turnsLine = document.createElement("div");
    turnsLine.textContent = t("player_effect_turns_label", { turns: effect.remainingRounds });

    item.appendChild(title);
    item.appendChild(effectLine);
    item.appendChild(turnsLine);
    els.playerEffectsList.appendChild(item);
  });
}

function renderSkills() {
  renderSkillItems(els.skillList, state.unlockedSkills, t("no_skills"));
}

function renderSkillItems(container, skills, emptyText) {
  if (skills.length === 0) {
    container.className = "skill-list muted";
    container.textContent = emptyText;
    return;
  }

  container.className = "skill-list";
  container.textContent = "";

  skills.forEach((skill) => {
    const item = document.createElement("div");
    item.className = "skill-item";

    const title = document.createElement("strong");
    title.textContent = getSkillName(skill);

    const desc = document.createElement("div");
    desc.textContent = getSkillDescription(skill);

    const effect = document.createElement("div");
    effect.textContent = getSkillEffectText(skill);

    item.appendChild(title);
    item.appendChild(desc);
    item.appendChild(effect);
    container.appendChild(item);
  });
}

function formatActionLog(entry) {
  let summary = `${t("action_prefix", { player: entry.actingPlayer })} `;

  if (entry.instantAmount > 0 && entry.instantType === "damage") {
    summary += `${t("instant_damage_summary", { amount: entry.instantAmount })} `;
  } else if (entry.instantAmount > 0 && entry.instantType === "heal") {
    summary += `${t("instant_heal_summary", { amount: entry.instantAmount })} `;
  }

  if (entry.dotAmount > 0 && entry.dotTurnsApplied > 0) {
    if (entry.dotType === "damage") {
      summary += `${t("dot_damage_summary", {
        amount: entry.dotAmount,
        turns: Math.max(0, entry.dotTurnsApplied - 1),
      })} `;
    } else {
      summary += `${t("dot_heal_summary", {
        amount: entry.dotAmount,
        turns: Math.max(0, entry.dotTurnsApplied - 1),
      })} `;
    }
  }

  if (!entry.hasEffect) {
    summary += `${t("no_direct_change")} `;
  }

  if (entry.note) {
    summary += `${t("note_summary", { note: entry.note })} `;
  }

  if (entry.skill && entry.skillSummary) {
    summary += `${t("skill_summary", { skill: getSkillName(entry.skill) })} ${entry.skillSummary}`;
  }

  return summary.trim();
}

function formatLogMessage(entry) {
  if (entry.type === "i18n") {
    return t(entry.key, entry.params);
  }

  if (entry.type === "effect-resolve") {
    const remaining =
      entry.remainingTurns > 0 ? t("remaining_turns", { count: entry.remainingTurns }) : t("effect_ended");
    return t(entry.effectType === "damage" ? "auto_resolve_damage" : "auto_resolve_heal", {
      source: entry.source,
      amount: entry.amount,
      remaining,
    });
  }

  if (entry.type === "action") {
    return formatActionLog(entry);
  }

  return entry.text;
}

function renderLog() {
  els.log.textContent = "";

  state.logEntries.forEach((entry) => {
    const node = document.createElement("div");
    node.className = "log-entry";
    node.textContent = `[${new Date(entry.timestamp).toLocaleTimeString(
      state.language === "en" ? "en-US" : "zh-CN",
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      },
    )}] ${formatLogMessage(entry)}`;
    els.log.appendChild(node);
  });
}

function addLog(entry) {
  state.logEntries.unshift({
    ...entry,
    timestamp: Date.now(),
  });
  renderLog();
}

musicPlayer.addEventListener("ended", advancePlaylistTrack);
musicPlayer.addEventListener("error", advancePlaylistTrack);

document.addEventListener("pointerdown", () => {
  if (musicState.hasInteracted) {
    return;
  }

  musicState.hasInteracted = true;
  syncMusicToPhase();
});

els.musicToggleBtn.addEventListener("click", toggleMusicEnabled);
els.setupForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const playerCount = Number(els.playerCount.value);
  const initialHp = Number(els.initialHp.value);
  const initialSkillCount = Number(els.initialSkillCount.value);

  if (!Number.isInteger(playerCount) || playerCount <= 0) {
    addLog({ type: "i18n", key: "invalid_player_count" });
    return;
  }

  if (!Number.isInteger(initialHp) || initialHp < 0) {
    addLog({ type: "i18n", key: "invalid_initial_hp" });
    return;
  }

  if (!Number.isInteger(initialSkillCount) || initialSkillCount < 0) {
    addLog({ type: "i18n", key: "invalid_initial_skill_count" });
    return;
  }

  initializeGame(playerCount, initialHp, initialSkillCount);
});

els.endTurnBtn.addEventListener("click", advanceGatherTurn);
els.startFightBtn.addEventListener("click", startFight);
els.gatherSkillToggleBtn.addEventListener("click", openSkillModal);
els.battleForm.addEventListener("submit", applyBattleAction);
els.bossDamageBtn.addEventListener("click", () => {
  manualAdjustBoss(-1, "hit", "manual_boss_minus");
});
els.bossHealBtn.addEventListener("click", () => {
  manualAdjustBoss(1, "heal", "manual_boss_plus");
});
els.instantEffectType.addEventListener("change", updateEffectInputHints);
els.dotEffectType.addEventListener("change", updateEffectInputHints);
els.langButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setLanguage(button.dataset.lang);
  });
});
els.skillToggleBtn.addEventListener("click", openSkillModal);
els.skillCloseBtn.addEventListener("click", closeSkillModal);
els.skillBackdrop.addEventListener("click", closeSkillModal);
els.skillAnnouncementCloseBtn.addEventListener("click", closeSkillAnnouncement);
els.skillAnnouncementBackdrop.addEventListener("click", closeSkillAnnouncement);
els.logToggleBtn.addEventListener("click", openLogModal);
els.logCloseBtn.addEventListener("click", closeLogModal);
els.logBackdrop.addEventListener("click", closeLogModal);
els.defeatCloseBtn.addEventListener("click", () => {
  state.defeatCgDismissed = true;
  updateDefeatCg();
});

switchScreen("setupScreen");
setLanguage("en");
syncMusicToPhase();
