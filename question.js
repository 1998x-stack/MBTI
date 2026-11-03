// src/data/questions.js
// MBTI游戏化测试问题数据库

export const questions = [
    // 外向性 vs 内向性 (E/I) 测试
    {
        id: 1,
        category: 'energy',
        text: "在一个陌生的聚会上，你会...",
        scenario: "🎉 你被邀请参加一个朋友的生日聚会，但你发现大部分人你都不认识。音乐很大声，人们在聊天、跳舞。这种环境让你...",
        gameElement: "party",
        image: "/images/scenarios/party.jpg",
        options: [
            { 
                text: "感到兴奋，主动走向人群开始对话", 
                type: "E", 
                value: 3,
                emoji: "🗣️",
                feedback: "你从与他人的互动中获得能量！"
            },
            { 
                text: "找一个看起来友好的人，慢慢开始交流", 
                type: "E", 
                value: 1,
                emoji: "👋",
                feedback: "你喜欢社交，但更倾向于一对一的交流"
            },
            { 
                text: "找个安静的角落，观察周围的人和环境", 
                type: "I", 
                value: 1,
                emoji: "👀",
                feedback: "你喜欢先观察和思考"
            },
            { 
                text: "很快就想离开，感觉能量被消耗", 
                type: "I", 
                value: 3,
                emoji: "🚪",
                feedback: "大型社交场合让你感到疲惫"
            }
        ]
    },
    
    {
        id: 2,
        category: 'structure',
        text: "制定周末计划时，你倾向于...",
        scenario: "🗓️ 周五晚上，你正在考虑周末要做什么。有很多可能性：看电影、和朋友聚会、学习新技能、或者就是放松。你的反应是...",
        gameElement: "planning",
        image: "/images/scenarios/weekend.jpg",
        options: [
            { 
                text: "制定详细的时间表，每个时段都安排好", 
                type: "J", 
                value: 3,
                emoji: "📋",
                feedback: "你喜欢井然有序的生活"
            },
            { 
                text: "有个大致想法，但保持一定灵活性", 
                type: "J", 
                value: 1,
                emoji: "📝",
                feedback: "你喜欢有计划但不过于严格"
            },
            { 
                text: "看当时的心情和出现的机会来决定", 
                type: "P", 
                value: 1,
                emoji: "🎲",
                feedback: "你享受生活的不确定性"
            },
            { 
                text: "完全不做计划，完全随性而为", 
                type: "P", 
                value: 3,
                emoji: "🌊",
                feedback: "你是真正的自由灵魂"
            }
        ]
    },

    {
        id: 3,
        category: 'decision',
        text: "面对一个复杂问题时，你会...",
        scenario: "🧩 你的团队遇到了一个复杂的项目难题，需要找到解决方案。时间有点紧迫，大家都在等待决策。你的第一反应是...",
        gameElement: "problem_solving",
        image: "/images/scenarios/problem.jpg",
        options: [
            { 
                text: "收集数据，分析所有相关的逻辑关系", 
                type: "T", 
                value: 3,
                emoji: "📊",
                feedback: "你相信数据和逻辑分析"
            },
            { 
                text: "客观地权衡各种因素和可能后果", 
                type: "T", 
                value: 1,
                emoji: "⚖️",
                feedback: "你倾向于理性思考"
            },
            { 
                text: "考虑这个决定对团队成员的影响", 
                type: "F", 
                value: 1,
                emoji: "🤝",
                feedback: "你关心他人的感受"
            },
            { 
                text: "重点关注大家的感受和团队和谐", 
                type: "F", 
                value: 3,
                emoji: "❤️",
                feedback: "你把人际关系放在首位"
            }
        ]
    },

    {
        id: 4,
        category: 'information',
        text: "学习新知识时，你更喜欢...",
        scenario: "📚 你报名了一个新的在线课程。平台提供了不同的学习方式，你会选择...",
        gameElement: "learning",
        image: "/images/scenarios/learning.jpg",
        options: [
            { 
                text: "通过具体的案例和实际操作来学习", 
                type: "S", 
                value: 3,
                emoji: "🔧",
                feedback: "你是实践派学习者"
            },
            { 
                text: "先掌握基本概念和详细步骤", 
                type: "S", 
                value: 1,
                emoji: "📖",
                feedback: "你喜欢循序渐进"
            },
            { 
                text: "了解背后的理论原理和大局观", 
                type: "N", 
                value: 1,
                emoji: "🔍",
                feedback: "你喜欢理解本质"
            },
            { 
                text: "探索各种可能性和创新应用方式", 
                type: "N", 
                value: 3,
                emoji: "💡",
                feedback: "你是天生的创新者"
            }
        ]
    },

    {
        id: 5,
        category: 'motivation',
        text: "在工作中，你更容易被什么激励？",
        scenario: "💼 你正在考虑两个工作机会，它们在薪资和地位上差不多，但工作内容和环境不同。你更倾向于选择...",
        gameElement: "career",
        image: "/images/scenarios/work.jpg",
        options: [
            { 
                text: "有清晰KPI和可衡量成果的工作", 
                type: "T", 
                value: 3,
                emoji: "🎯",
                feedback: "你被明确的目标所驱动"
            },
            { 
                text: "充满挑战和需要解决复杂问题的工作", 
                type: "T", 
                value: 1,
                emoji: "🧠",
                feedback: "你享受智力挑战"
            },
            { 
                text: "能帮助他人，产生积极社会影响的工作", 
                type: "F", 
                value: 1,
                emoji: "🌱",
                feedback: "你渴望创造意义"
            },
            { 
                text: "重视团队合作和和谐氛围的工作", 
                type: "F", 
                value: 3,
                emoji: "👥",
                feedback: "人际关系是你的动力源泉"
            }
        ]
    },

    {
        id: 6,
        category: 'communication',
        text: "当朋友找你倾诉烦恼时，你通常会...",
        scenario: "💬 你的好朋友刚刚和你分享了他们在工作中遇到的挫折，看起来很沮丧和困惑。面对这种情况，你的本能反应是...",
        gameElement: "support",
        image: "/images/scenarios/friend.jpg",
        options: [
            { 
                text: "分析问题的根本原因并提供具体建议", 
                type: "T", 
                value: 3,
                emoji: "🔧",
                feedback: "你是天生的问题解决者"
            },
            { 
                text: "帮助他们理清思路，找到解决路径", 
                type: "T", 
                value: 1,
                emoji: "🗺️",
                feedback: "你善于提供理性指导"
            },
            { 
                text: "专心倾听，给予情感支持和理解", 
                type: "F", 
                value: 1,
                emoji: "👂",
                feedback: "你是贴心的倾听者"
            },
            { 
                text: "陪伴在旁，让他们感受到关爱和温暖", 
                type: "F", 
                value: 3,
                emoji: "🤗",
                feedback: "你的存在就是最好的安慰"
            }
        ]
    },

    {
        id: 7,
        category: 'adaptation',
        text: "面对突如其来的变化时，你的第一反应是...",
        scenario: "🔄 你刚刚收到通知，原本计划好的重要会议突然改期，而且新的时间与你的其他安排有冲突。你会...",
        gameElement: "change",
        image: "/images/scenarios/change.jpg",
        options: [
            { 
                text: "感到兴奋，这可能带来新的机会", 
                type: "P", 
                value: 3,
                emoji: "🌟",
                feedback: "你拥抱变化和不确定性"
            },
            { 
                text: "保持开放心态，看看会发生什么", 
                type: "P", 
                value: 1,
                emoji: "🤔",
                feedback: "你能适应变化"
            },
            { 
                text: "希望快速了解新的具体安排", 
                type: "J", 
                value: 1,
                emoji: "📋",
                feedback: "你需要重新规划"
            },
            { 
                text: "感到困扰，不喜欢计划被打乱", 
                type: "J", 
                value: 3,
                emoji: "😰",
                feedback: "你更喜欢稳定和可预测性"
            }
        ]
    },

    {
        id: 8,
        category: 'social',
        text: "在团队讨论中，你更可能...",
        scenario: "🗣️ 团队正在讨论一个重要的项目方案，每个人都可以发表自己的看法和建议。会议室里有8个人，讨论很热烈...",
        gameElement: "meeting",
        image: "/images/scenarios/meeting.jpg",
        options: [
            { 
                text: "积极发言，即时分享脑中的想法", 
                type: "E", 
                value: 3,
                emoji: "💬",
                feedback: "你通过说话来思考"
            },
            { 
                text: "在有十足把握时才发表观点", 
                type: "E", 
                value: 1,
                emoji: "🎯",
                feedback: "你喜欢分享，但比较谨慎"
            },
            { 
                text: "仔细倾听，在脑中整理和消化信息", 
                type: "I", 
                value: 1,
                emoji: "🧠",
                feedback: "你通过思考来处理信息"
            },
            { 
                text: "倾向于会后私下与关键人员交流", 
                type: "I", 
                value: 3,
                emoji: "👥",
                feedback: "你更喜欢深度的一对一交流"
            }
        ]
    },

    {
        id: 9,
        category: 'creativity',
        text: "进行创意思考时，你更倾向于...",
        scenario: "🎨 公司要求你为新产品想一个创新的营销方案。你有一周的时间来准备提案。你会...",
        gameElement: "creativity",
        image: "/images/scenarios/creative.jpg",
        options: [
            { 
                text: "研究成功案例，改进现有的营销模式", 
                type: "S", 
                value: 3,
                emoji: "📚",
                feedback: "你相信实践验证的方法"
            },
            { 
                text: "分析目标用户，制定精准的营销策略", 
                type: "S", 
                value: 1,
                emoji: "🎯",
                feedback: "你注重细节和实用性"
            },
            { 
                text: "跳出框架，思考全新的营销可能性", 
                type: "N", 
                value: 1,
                emoji: "💭",
                feedback: "你善于创新思维"
            },
            { 
                text: "构想革命性的营销概念和未来趋势", 
                type: "N", 
                value: 3,
                emoji: "🚀",
                feedback: "你是天生的愿景家"
            }
        ]
    },

    {
        id: 10,
        category: 'conflict',
        text: "面对团队冲突时，你会...",
        scenario: "⚡ 你的团队中两个成员因为工作方式不同产生了激烈争执，影响了整个项目的进度。作为团队一员，你会...",
        gameElement: "conflict",
        image: "/images/scenarios/conflict.jpg",
        options: [
            { 
                text: "分析冲突原因，提出客观的解决方案", 
                type: "T", 
                value: 3,
                emoji: "⚖️",
                feedback: "你用理性化解冲突"
            },
            { 
                text: "关注事实和规则，寻求公正的解决", 
                type: "T", 
                value: 1,
                emoji: "📏",
                feedback: "你坚持原则和公平"
            },
            { 
                text: "关注每个人的感受，促进相互理解", 
                type: "F", 
                value: 1,
                emoji: "💝",
                feedback: "你重视和谐与理解"
            },
            { 
                text: "优先考虑团队氛围，维护人际关系", 
                type: "F", 
                value: 3,
                emoji: "🤝",
                feedback: "你是天然的和平使者"
            }
        ]
    },

    {
        id: 11,
        category: 'routine',
        text: "对于日常例行公事，你的态度是...",
        scenario: "📅 你需要完成一系列重复性的工作任务，比如每周的报告、定期的检查等。对于这些例行工作，你...",
        gameElement: "routine",
        image: "/images/scenarios/routine.jpg",
        options: [
            { 
                text: "建立固定流程，按部就班地完成", 
                type: "J", 
                value: 3,
                emoji: "⏰",
                feedback: "你从结构中获得安全感"
            },
            { 
                text: "安排在固定时间，但方式可能变化", 
                type: "J", 
                value: 1,
                emoji: "📋",
                feedback: "你喜欢有计划但保持灵活"
            },
            { 
                text: "根据当时情况和心情来安排", 
                type: "P", 
                value: 1,
                emoji: "🎭",
                feedback: "你需要变化来保持兴趣"
            },
            { 
                text: "经常拖延，直到最后期限才完成", 
                type: "P", 
                value: 3,
                emoji: "⏳",
                feedback: "你在压力下表现最好"
            }
        ]
    },

    {
        id: 12,
        category: 'focus',
        text: "在嘈杂的环境中工作时，你会...",
        scenario: "🔊 你需要在一个开放式的办公室完成一项重要工作，周围有同事在讨论，电话响起，还有各种办公设备的声音...",
        gameElement: "focus",
        image: "/images/scenarios/noise.jpg",
        options: [
            { 
                text: "完全不受影响，甚至觉得有活力", 
                type: "E", 
                value: 3,
                emoji: "🎵",
                feedback: "外部刺激让你更有活力"
            },
            { 