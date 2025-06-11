// 状态管理
const state = {
    currentScreen: 'welcome',
    currentQuestion: 0,
    scores: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 },
    achievements: [],
    questions: [],
    personalityTypes: []
};

// 内联问题数据（避免CORS问题）
const inlineQuestions = [
    {
        "text": "朋友突然邀请你参加派对，你会？",
        "options": [
            {
                "text": "立刻回复：马上到！",
                "scores": { "E": 10, "P": 5 }
            },
            {
                "text": "查看日程安排再决定",
                "scores": { "J": 8, "I": 3 }
            },
            {
                "text": "找个借口婉拒",
                "scores": { "I": 10, "F": 5 }
            },
            {
                "text": "问清楚派对细节再做决定",
                "scores": { "S": 7, "J": 5 }
            }
        ]
    },
    {
        "text": "团队项目中出现分歧，你会？",
        "options": [
            {
                "text": "组织讨论找出最佳方案",
                "scores": { "E": 8, "J": 7 }
            },
            {
                "text": "分析各种方案的优缺点",
                "scores": { "T": 10, "N": 5 }
            },
            {
                "text": "照顾每个人的感受",
                "scores": { "F": 10, "S": 3 }
            },
            {
                "text": "提出创新解决方案",
                "scores": { "N": 8, "P": 7 }
            }
        ]
    },
    {
        "text": "周末空闲时，你会选择？",
        "options": [
            {
                "text": "和朋友一起出去玩",
                "scores": { "E": 10 }
            },
            {
                "text": "在家看书或看电影",
                "scores": { "I": 10, "S": 5 }
            },
            {
                "text": "学习新技能或知识",
                "scores": { "N": 8, "T": 7 }
            },
            {
                "text": "整理房间做规划",
                "scores": { "J": 10, "S": 3 }
            }
        ]
    },
    {
        "text": "面对截止日期，你会？",
        "options": [
            {
                "text": "提前完成并检查多次",
                "scores": { "J": 10, "S": 5 }
            },
            {
                "text": "在最后时刻高效完成",
                "scores": { "P": 10, "N": 5 }
            },
            {
                "text": "制定详细计划分步完成",
                "scores": { "T": 8, "J": 7 }
            },
            {
                "text": "寻求帮助共同完成",
                "scores": { "F": 8, "E": 7 }
            }
        ]
    },
    {
        "text": "旅行时，你更倾向于？",
        "options": [
            {
                "text": "详细规划每个行程",
                "scores": { "J": 10, "S": 5 }
            },
            {
                "text": "随性探索未知地点",
                "scores": { "P": 10, "N": 7 }
            },
            {
                "text": "与当地人交流互动",
                "scores": { "E": 10, "F": 5 }
            },
            {
                "text": "安静观察和体验文化",
                "scores": { "I": 10, "S": 7 }
            }
        ]
    },
    {
        "text": "遇到难题时，你通常会？",
        "options": [
            {
                "text": "分析逻辑和事实",
                "scores": { "T": 10, "S": 5 }
            },
            {
                "text": "考虑他人感受和影响",
                "scores": { "F": 10, "E": 3 }
            },
            {
                "text": "寻求创新解决方案",
                "scores": { "N": 10, "P": 5 }
            },
            {
                "text": "遵循标准处理流程",
                "scores": { "S": 8, "J": 7 }
            }
        ]
    },
    {
        "text": "在社交场合中，你通常？",
        "options": [
            {
                "text": "主动与陌生人交谈",
                "scores": { "E": 10 }
            },
            {
                "text": "只与熟悉的人交流",
                "scores": { "I": 10, "F": 3 }
            },
            {
                "text": "观察周围环境与人",
                "scores": { "S": 8, "I": 5 }
            },
            {
                "text": "思考活动背后的意义",
                "scores": { "N": 8, "T": 5 }
            }
        ]
    },
    {
        "text": "选择书籍时，你更喜欢？",
        "options": [
            {
                "text": "实用技能或指南类",
                "scores": { "S": 10, "T": 5 }
            },
            {
                "text": "科幻或哲学类",
                "scores": { "N": 10, "P": 3 }
            },
            {
                "text": "情感丰富的小说",
                "scores": { "F": 10, "E": 3 }
            },
            {
                "text": "自传或纪实文学",
                "scores": { "S": 8, "J": 5 }
            }
        ]
    },
    {
        "text": "当朋友情绪低落时，你会？",
        "options": [
            {
                "text": "给予情感支持和安慰",
                "scores": { "F": 10, "E": 5 }
            },
            {
                "text": "提供实际解决方案",
                "scores": { "T": 10, "S": 5 }
            },
            {
                "text": "分享类似经历",
                "scores": { "E": 8, "F": 5 }
            },
            {
                "text": "给予空间让其独处",
                "scores": { "I": 10, "T": 3 }
            }
        ]
    },
    {
        "text": "关于未来，你更关注？",
        "options": [
            {
                "text": "当前的实际进展",
                "scores": { "S": 10, "J": 5 }
            },
            {
                "text": "长远的发展可能",
                "scores": { "N": 10, "P": 5 }
            },
            {
                "text": "人际关系的发展",
                "scores": { "F": 10, "E": 5 }
            },
            {
                "text": "个人目标的实现",
                "scores": { "T": 8, "I": 5 }
            }
        ]
    },
    {
        "text": "学习新事物时，你偏好？",
        "options": [
            {
                "text": "系统化学习结构",
                "scores": { "J": 10, "S": 7 }
            },
            {
                "text": "自由探索不同方面",
                "scores": { "P": 10, "N": 5 }
            },
            {
                "text": "与他人讨论学习",
                "scores": { "E": 10, "F": 5 }
            },
            {
                "text": "独自深入研究",
                "scores": { "I": 10, "T": 5 }
            }
        ]
    },
    {
        "text": "当计划被打乱时，你通常？",
        "options": [
            {
                "text": "感到焦虑和困扰",
                "scores": { "J": 10, "S": 5 }
            },
            {
                "text": "灵活调整适应变化",
                "scores": { "P": 10, "N": 5 }
            },
            {
                "text": "寻求他人帮助解决",
                "scores": { "E": 8, "F": 5 }
            },
            {
                "text": "分析原因防止再发生",
                "scores": { "T": 10, "I": 3 }
            }
        ]
    }
];

// 内联人格类型数据（避免CORS问题）
const inlineTypes = [
    {
        "id": "ENTJ",
        "animal": "霸王龙",
        "animalImage": "assets/images/entj-dino.png",
        "description": "你是天生的领导者！像霸王龙一样充满力量和决断力。总是能快速做出决策并带领团队前进，但偶尔会忘记队友跟不上你的迅猛步伐。你的口头禅是：'按我说的做就对了！'"
    },
    {
        "id": "ENTP",
        "animal": "狐狸",
        "animalImage": "assets/images/entp-fox.png",
        "description": "机智如狐的创意大师！你总能找到解决问题的创新方法，辩论时无人能敌。但三分钟热度是你的特点——昨天还在研究区块链，今天可能就在学陶艺了。"
    },
    {
        "id": "ENFJ",
        "animal": "海豚",
        "animalImage": "assets/images/enfj-dolphin.png",
        "description": "温暖治愈的社交达人！像海豚一样善于沟通和激励他人。朋友圈里的知心姐姐/哥哥，总能敏锐察觉他人情绪。缺点是常把别人的问题当成自己的责任。"
    },
    {
        "id": "ENFP",
        "animal": "鹦鹉",
        "animalImage": "assets/images/enfp-parrot.png",
        "description": "热情四射的派对鹦鹉！充满创意和活力，能把任何平淡场合变成欢乐派对。兴趣广泛但注意力像小鸟一样容易飞走，经常同时开启十个项目完成零个。"
    },
    {
        "id": "ESTJ",
        "animal": "蜜蜂",
        "animalImage": "/assets/images/estj-bee.png",
        "description": "高效自律的团队骨干！像工蜂一样勤勉可靠，是维持组织运转的关键人物。讨厌混乱无序，会默默整理别人乱放的咖啡杯。口头禅：'凡事要有个计划！'"
    },
    {
        "id": "ESTP",
        "animal": "猎豹",
        "animalImage": "assets/images/estp-cheetah.png",
        "description": "行动力爆表的冒险家！如猎豹般敏捷，活在当下享受刺激。讨厌理论更爱实践，是危机处理高手。但长期计划？那是什么？明天的事明天再说！"
    },
    {
        "id": "ESFJ",
        "animal": "狗狗",
        "animalImage": "assets/images/esfj-dog.png",
        "description": "忠诚贴心的守护者！像金毛犬一样温暖友善，总在照顾他人需求。记得所有朋友的生日，但可能因过度关注他人而忽略自己。"
    },
    {
        "id": "ESFP",
        "animal": "孔雀",
        "animalImage": "assets/images/esfp-peacock.png",
        "description": "魅力四射的表演家！如孔雀般耀眼迷人，天生聚光灯体质。能用幽默化解尴尬，是派对气氛担当。但可能因太爱即兴发挥而忘记重要约会。"
    },
    {
        "id": "INTJ",
        "animal": "猫头鹰",
        "animalImage": "assets/images/intj-owl.png",
        "description": "深谋远虑的策略大师！像夜行猫头鹰般独立敏锐，擅长制定长远计划。相信数据胜过感情，口头禅是'这不合理'。社交对你而言是低效的能源消耗。"
    },
    {
        "id": "INTP",
        "animal": "树懒",
        "animalImage": "assets/images/intp-sloth.png",
        "description": "理性至上的思考者！树懒式生活哲学——动得少但想得多。能花六小时研究一个理论问题，却会忘记吃饭。社交提示：当你说'有趣...'时，实际在想'这毫无逻辑'。"
    },
    {
        "id": "INFJ",
        "animal": "独角兽",
        "animalImage": "assets/images/infj-unicorn.png",
        "description": "神秘感性的理想主义者！如独角兽般稀有且充满诗意。能看透人心却常被误解，在社交与独处间反复横跳。表面平静，内心每天上演八十集连续剧。"
    },
    {
        "id": "INFP",
        "animal": "吟游诗人",
        "animalImage": "assets/images/infp-bard.png",
        "description": "浪漫主义的梦想家！内心住着吟游诗人，对不公零容忍。常因看到流浪猫或美丽晚霞突然落泪。理想职业：在森林小屋里写诗同时拯救世界。"
    },
    {
        "id": "ISTJ",
        "animal": "大象",
        "animalImage": "assets/images/istj-elephant.png",
        "description": "踏实可靠的执行者！如大象般稳重值得信赖。遵守规则且注重细节，是团队定心丸。但面对突发变化可能像大象看到老鼠——瞬间僵住。"
    },
    {
        "id": "ISTP",
        "animal": "浣熊",
        "animalImage": "assets/images/istp-raccoon.png",
        "description": "动手能力MAX的探索者！像浣熊一样好奇且擅长拆解重组物品。能修好任何机器却修不好人际关系。口头禅：'让我看看这东西怎么运作的'。"
    },
    {
        "id": "ISFJ",
        "animal": "企鹅",
        "animalImage": "assets/images/isfj-penguin.png",
        "description": "细致入微的守护者！如企鹅般忠诚顾家，默默记住所有人的喜好。是朋友行走的备忘录，但常因过度付出被当作工具人。需要学习说'不'的勇气课。"
    },
    {
        "id": "ISFP",
        "animal": "熊猫",
        "animalImage": "assets/images/isfp-panda.png",
        "description": "温和敏感的艺术家！熊猫式生活哲学——随性自在享受当下。擅长用艺术表达情感，讨厌冲突到会主动帮吵架双方点奶茶。人生信条：'世界和平，万物可爱'。"
    }
];

// DOM 元素
const screens = {
    welcome: document.getElementById('welcome-screen'),
    test: document.getElementById('test-screen'),
    result: document.getElementById('result-screen')
};

// 初始化应用
function initApp() {
    // 使用内联数据
    state.questions = inlineQuestions;
    state.personalityTypes = inlineTypes;
    
    // 设置事件监听
    document.getElementById('start-btn').addEventListener('click', startTest);
    document.getElementById('retry-btn').addEventListener('click', resetTest);
    document.getElementById('share-btn').addEventListener('click', shareResult);
}

// 开始测试
function startTest() {
    showScreen('test');
    displayQuestion();
}

// 重置测试
function resetTest() {
    state.currentQuestion = 0;
    state.scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    state.achievements = [];
    updateProgressBars();
    startTest();
}

// 显示屏幕
function showScreen(screenName) {
    // 隐藏所有屏幕
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
    });
    
    // 显示当前屏幕
    screens[screenName].classList.add('active');
    state.currentScreen = screenName;
}

// 显示问题
function displayQuestion() {
    const question = state.questions[state.currentQuestion];
    if (!question) return showResults();
    
    // 更新问题文本
    document.getElementById('question-text').textContent = question.text;
    
    // 更新进度
    document.getElementById('current-q').textContent = state.currentQuestion + 1;
    document.getElementById('question-progress').style.width = 
        `${((state.currentQuestion + 1) / state.questions.length) * 100}%`;
    
    // 创建选项
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.innerHTML = `
            <div class="option-content">
                <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                <span class="option-text">${option.text}</span>
            </div>
        `;
        
        optionElement.addEventListener('click', () => selectOption(option));
        optionsContainer.appendChild(optionElement);
    });
}

// 选择选项
function selectOption(option) {
    // 更新分数
    Object.keys(option.scores).forEach(dimension => {
        state.scores[dimension] += option.scores[dimension];
    });
    
    // 检查成就
    checkAchievements();
    
    // 更新进度条
    updateProgressBars();
    
    // 下一个问题或显示结果
    state.currentQuestion++;
    if (state.currentQuestion < state.questions.length) {
        displayQuestion();
    } else {
        showResults();
    }
}

// 更新维度进度条
function updateProgressBars() {
    // 计算每个维度的百分比
    const ePercentage = (state.scores.E / (state.scores.E + state.scores.I)) * 100 || 50;
    const sPercentage = (state.scores.S / (state.scores.S + state.scores.N)) * 100 || 50;
    const tPercentage = (state.scores.T / (state.scores.T + state.scores.F)) * 100 || 50;
    const jPercentage = (state.scores.J / (state.scores.J + state.scores.P)) * 100 || 50;
    
    // 应用百分比
    document.getElementById('e-bar').style.width = `${ePercentage}%`;
    document.getElementById('s-bar').style.width = `${sPercentage}%`;
    document.getElementById('t-bar').style.width = `${tPercentage}%`;
    document.getElementById('j-bar').style.width = `${jPercentage}%`;
}

// 检查成就
function checkAchievements() {
    // 社交成就
    if (state.scores.I > 30 && !state.achievements.some(a => a.id === 'introvert')) {
        state.achievements.push({
            id: 'introvert',
            title: '深度宅',
            description: '连续5题选择独处选项'
        });
    }
    
    // 直觉成就
    if (state.scores.N > 30 && !state.achievements.some(a => a.id === 'intuitive')) {
        state.achievements.push({
            id: 'intuitive',
            title: '脑洞大师',
            description: '直觉维度达到顶峰'
        });
    }
    
    // 情感成就
    if (state.scores.F > 25 && !state.achievements.some(a => a.id === 'feeler')) {
        state.achievements.push({
            id: 'feeler',
            title: '情感丰富',
            description: '情感维度超过思维'
        });
    }
    
    // 决策成就
    if (state.scores.J > 30 && !state.achievements.some(a => a.id === 'judger')) {
        state.achievements.push({
            id: 'judger',
            title: '计划控',
            description: '判断维度得分最高'
        });
    }
}

// 显示结果
function showResults() {
    showScreen('result');
    
    // 确定MBTI类型
    const mbtiType = 
        (state.scores.E > state.scores.I ? 'E' : 'I') +
        (state.scores.S > state.scores.N ? 'S' : 'N') +
        (state.scores.T > state.scores.F ? 'T' : 'F') +
        (state.scores.J > state.scores.P ? 'J' : 'P');
    
    // 查找类型数据
    const personality = state.personalityTypes.find(type => type.id === mbtiType) || 
                       state.personalityTypes[0];
    
    // 更新UI
    document.getElementById('type-title').textContent = personality.animal;
    document.getElementById('type-acronym').textContent = mbtiType;
    document.getElementById('type-description').textContent = personality.description;
    
    // 设置动物图片（使用占位符）
    const animalImage = document.getElementById('animal-image');
    animalImage.alt = `${personality.animal} 形象`;
    
    // 显示成就
    displayAchievements();
    
    // 庆祝效果
    celebrate();
}

// 显示成就
function displayAchievements() {
    const badgesContainer = document.getElementById('badges-container');
    badgesContainer.innerHTML = '';
    
    state.achievements.forEach(achievement => {
        const badge = document.createElement('div');
        badge.className = 'badge';
        badge.innerHTML = `
            <i class="fa-solid fa-medal"></i>
            <h4>${achievement.title}</h4>
            <p class="badge-desc">${achievement.description}</p>
        `;
        badgesContainer.appendChild(badge);
    });
}

// 庆祝效果
function celebrate() {
    // 使用第三方confetti库
    const defaults = {
        spread: 360,
        ticks: 70,
        gravity: 0,
        decay: 0.95,
        startVelocity: 30,
        colors: ['#0066cc', '#ff9500', '#ff2d55', '#4cd964', '#ffcc00'],
        origin: { y: 0.6 }
    };
    
    confetti({
        ...defaults,
        particleCount: 80
    });
    
    setTimeout(() => {
        confetti({
            ...defaults,
            particleCount: 50,
            scalar: 1.2
        });
    }, 200);
}

// 分享结果
function shareResult() {
    const type = document.getElementById('type-acronym').textContent;
    const animal = document.getElementById('type-title').textContent;
    
    if (navigator.share) {
        navigator.share({
            title: `我是${animal}型人格 (${type})`,
            text: `我在Personality Zoo的测试结果是${animal}型${type}人格，快来发现你的人格动物吧！`,
            url: window.location.href
        }).catch(console.error);
    } else {
        alert(`分享你的结果：我是${animal}型人格 (${type})！\n复制链接分享给朋友：${window.location.href}`);
    }
}

// 初始化应用
window.addEventListener('DOMContentLoaded', initApp);