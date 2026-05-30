
import { Word, ConfusablePair } from '../types';

export const advancedWords: Word[] = [
  {
    word: 'perspicacious',
    definition: '敏锐的，有洞察力的',
    collocations: ['perspicacious observation', 'perspicacious analysis', 'perspicacious judgment'],
    synonyms: ['astute', 'shrewd', 'perceptive', 'discerning'],
    example: 'Her perspicacious insights into human nature made her an exceptional novelist.',
    root: 'per- (through) + spic (look) + -acious',
    level: 'ielts'
  },
  {
    word: 'ubiquitous',
    definition: '无处不在的，普遍存在的',
    collocations: ['ubiquitous presence', 'ubiquitous technology', 'ubiquitous phenomenon'],
    synonyms: ['omnipresent', 'pervasive', 'universal', 'everywhere'],
    example: 'Smartphones have become ubiquitous in modern society.',
    root: 'ubi (where) + -quitous',
    level: 'cet6'
  },
  {
    word: 'serendipity',
    definition: '意外发现珍奇事物的本领，机缘凑巧',
    collocations: ['pure serendipity', 'by serendipity', 'happy serendipity'],
    synonyms: ['fortuity', 'chance', 'luck', 'happy accident'],
    example: 'The discovery of penicillin was a triumph of serendipity.',
    root: 'from Serendip, an old name for Sri Lanka',
    level: 'kaoyan'
  },
  {
    word: 'ephemeral',
    definition: '短暂的，瞬息的',
    collocations: ['ephemeral beauty', 'ephemeral nature', 'ephemeral moment'],
    synonyms: ['transient', 'fleeting', 'temporary', 'momentary'],
    example: 'Fame in the digital age can be surprisingly ephemeral.',
    root: 'ephemera (dayfly) + -al',
    level: 'ielts'
  },
  {
    word: 'quintessential',
    definition: '典型的，完美的典范',
    collocations: ['quintessential example', 'quintessential quality', 'quintessential feature'],
    synonyms: ['typical', 'classic', 'archetypal', 'representative'],
    example: 'The Eiffel Tower is the quintessential symbol of Paris.',
    root: 'quintessence (fifth element) + -ial',
    level: 'kaoyan'
  },
  {
    word: 'eloquent',
    definition: '雄辩的，有说服力的',
    collocations: ['eloquent speech', 'eloquent writer', 'eloquent expression'],
    synonyms: ['articulate', 'fluent', 'expressive', 'persuasive'],
    example: 'His eloquent argument convinced even the skeptics.',
    root: 'e- (out) + loqui (speak) + -ent',
    level: 'cet6'
  },
  {
    word: 'ambiguous',
    definition: '模棱两可的，含糊不清的',
    collocations: ['ambiguous statement', 'ambiguous meaning', 'ambiguous situation'],
    synonyms: ['vague', 'unclear', 'equivocal', 'obscure'],
    example: 'The politician gave an ambiguous answer to avoid controversy.',
    root: 'ambi- (both) + agere (drive) + -ous',
    level: 'cet4'
  },
  {
    word: 'resilient',
    definition: '有弹性的，能恢复的',
    collocations: ['resilient spirit', 'resilient economy', 'resilient community'],
    synonyms: ['tough', 'adaptable', 'buoyant', 'strong'],
    example: 'The resilient population rebuilt their city after the disaster.',
    root: 're- (back) + silire (leap) + -ent',
    level: 'cet6'
  },
  {
    word: 'meticulous',
    definition: '一丝不苟的，细心的',
    collocations: ['meticulous attention', 'meticulous care', 'meticulous work'],
    synonyms: ['careful', 'thorough', 'precise', 'detailed'],
    example: 'She was meticulous in checking every detail of the contract.',
    root: 'meticulus (fearful) + -ous',
    level: 'ielts'
  },
  {
    word: 'paradox',
    definition: '悖论，自相矛盾的说法',
    collocations: ['apparent paradox', 'strange paradox', 'classic paradox'],
    synonyms: ['contradiction', 'enigma', 'puzzle', 'oxymoron'],
    example: 'It is a paradox that in the digital age we feel more disconnected.',
    root: 'para- (contrary) + doxa (opinion)',
    level: 'kaoyan'
  },
  {
    word: 'pragmatic',
    definition: '务实的，讲究实际的',
    collocations: ['pragmatic approach', 'pragmatic solution', 'pragmatic decision'],
    synonyms: ['practical', 'realistic', 'sensible', 'down-to-earth'],
    example: 'We need a pragmatic approach to solve this complex problem.',
    root: 'pragma (deed) + -tic',
    level: 'cet6'
  },
  {
    word: 'vulnerable',
    definition: '脆弱的，易受伤害的',
    collocations: ['vulnerable position', 'vulnerable group', 'vulnerable ecosystem'],
    synonyms: ['fragile', 'sensitive', 'susceptible', 'weak'],
    example: 'Children are particularly vulnerable to colds in winter.',
    root: 'vulnus (wound) + -able',
    level: 'cet4'
  },
  {
    word: 'ameliorate',
    definition: '改善，改良',
    collocations: ['ameliorate conditions', 'ameliorate suffering', 'ameliorate situation'],
    synonyms: ['improve', 'enhance', 'better', 'alleviate'],
    example: 'New policies were introduced to ameliorate poverty.',
    root: 'a- (to) + melior (better) + -ate',
    level: 'ielts'
  },
  {
    word: 'cogent',
    definition: '有说服力的，令人信服的',
    collocations: ['cogent argument', 'cogent evidence', 'cogent reason'],
    synonyms: ['convincing', 'compelling', 'valid', 'sound'],
    example: 'She presented a cogent case for reform.',
    root: 'cogens (compelling) + -ent',
    level: 'kaoyan'
  },
  {
    word: 'deleterious',
    definition: '有害的，有毒的',
    collocations: ['deleterious effect', 'deleterious impact', 'deleterious consequence'],
    synonyms: ['harmful', 'damaging', 'detrimental', 'injurious'],
    example: 'Smoking has deleterious effects on health.',
    root: 'deleter (destroyer) + -ious',
    level: 'ielts'
  },
  {
    word: 'ebullient',
    definition: '热情洋溢的，兴高采烈的',
    collocations: ['ebullient personality', 'ebullient enthusiasm', 'ebullient mood'],
    synonyms: ['exuberant', 'buoyant', 'cheerful', 'lively'],
    example: 'Her ebullient spirit infected everyone at the party.',
    root: 'e- (out) + bullire (boil) + -ent',
    level: 'kaoyan'
  },
  {
    word: 'fastidious',
    definition: '挑剔的，过分讲究的',
    collocations: ['fastidious taste', 'fastidious about', 'fastidious attention'],
    synonyms: ['fussy', 'particular', 'choosy', 'critical'],
    example: 'He was fastidious about the quality of his work.',
    root: 'fastidium (loathing) + -ous',
    level: 'ielts'
  },
  {
    word: 'garrulous',
    definition: '喋喋不休的，饶舌的',
    collocations: ['garrulous person', 'garrulous talk', 'garrulous nature'],
    synonyms: ['talkative', 'chatty', 'loquacious', 'verbose'],
    example: 'The garrulous taxi driver talked the entire journey.',
    root: 'garrulus (chattering) + -ous',
    level: 'kaoyan'
  },
  {
    word: 'iconoclastic',
    definition: '反传统的，打破旧习的',
    collocations: ['iconoclastic ideas', 'iconoclastic artist', 'iconoclastic approach'],
    synonyms: ['radical', 'unconventional', 'rebellious', 'heretical'],
    example: 'His iconoclastic views challenged established norms.',
    root: 'icono- (image) + clast (break) + -ic',
    level: 'ielts'
  },
  {
    word: 'juxtapose',
    definition: '并列，并置',
    collocations: ['juxtapose with', 'juxtapose against', 'juxtaposition of'],
    synonyms: ['place side by side', 'compare', 'contrast', 'pair'],
    example: 'The artist juxtaposed light and dark in his painting.',
    root: 'juxta- (near) + posit (place)',
    level: 'kaoyan'
  }
];

export const confusablePairs: ConfusablePair[] = [
  {
    id: '1',
    word1: {
      word: 'compliment',
      definition: '恭维，赞美',
      collocations: ['pay a compliment', 'receive a compliment', 'backhanded compliment'],
      synonyms: ['praise', 'flattery', 'commendation'],
      example: 'She complimented him on his excellent presentation.',
      level: 'cet4'
    },
    word2: {
      word: 'complement',
      definition: '补充，使完善',
      collocations: ['complement each other', 'natural complement', 'perfect complement'],
      synonyms: ['supplement', 'enhance', 'complete'],
      example: 'The wine complements the dish perfectly.',
      level: 'cet4'
    },
    difference: 'compliment 是赞美，complement 是补充'
  },
  {
    id: '2',
    word1: {
      word: 'considerate',
      definition: '体贴的，考虑周到的',
      collocations: ['considerate of others', 'very considerate', 'thoughtful and considerate'],
      synonyms: ['thoughtful', 'kind', 'attentive'],
      example: 'It was considerate of you to bring me flowers.',
      level: 'cet4'
    },
    word2: {
      word: 'considerable',
      definition: '相当大的，可观的',
      collocations: ['considerable amount', 'considerable influence', 'considerable success'],
      synonyms: ['substantial', 'significant', 'sizeable'],
      example: 'The project required considerable effort.',
      level: 'cet4'
    },
    difference: 'considerate 是体贴人的，considerable 是数量多的'
  },
  {
    id: '3',
    word1: {
      word: 'affect',
      definition: '影响（动词）',
      collocations: ['affect the outcome', 'deeply affect', 'seriously affect'],
      synonyms: ['influence', 'impact', 'change'],
      example: 'The weather will affect our travel plans.',
      level: 'cet4'
    },
    word2: {
      word: 'effect',
      definition: '效果（名词）；实现（动词）',
      collocations: ['positive effect', 'side effect', 'cause and effect'],
      synonyms: ['result', 'consequence', 'outcome'],
      example: 'The new law will take effect next month.',
      level: 'cet4'
    },
    difference: 'affect 主要作动词"影响"，effect 主要作名词"效果"'
  },
  {
    id: '4',
    word1: {
      word: 'eminent',
      definition: '著名的，杰出的',
      collocations: ['eminent scholar', 'eminent figure', 'eminent scientist'],
      synonyms: ['distinguished', 'renowned', 'prominent'],
      example: 'She is an eminent expert in her field.',
      level: 'cet6'
    },
    word2: {
      word: 'imminent',
      definition: '即将发生的，迫近的',
      collocations: ['imminent danger', 'imminent threat', 'imminent arrival'],
      synonyms: ['impending', 'looming', 'close'],
      example: 'They feared an imminent attack.',
      level: 'cet6'
    },
    difference: 'eminent 是杰出的，imminent 是即将发生的'
  },
  {
    id: '5',
    word1: {
      word: 'discreet',
      definition: '谨慎的，小心的',
      collocations: ['discreet silence', 'discreet inquiry', 'be discreet about'],
      synonyms: ['careful', 'prudent', 'tactful'],
      example: 'Please be discreet about this matter.',
      level: 'cet6'
    },
    word2: {
      word: 'discrete',
      definition: '离散的，独立的',
      collocations: ['discrete units', 'discrete elements', 'discrete categories'],
      synonyms: ['separate', 'distinct', 'individual'],
      example: 'The data is divided into discrete categories.',
      level: 'cet6'
    },
    difference: 'discreet 是谨慎的，discrete 是分离的'
  }
];
