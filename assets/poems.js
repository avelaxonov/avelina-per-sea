/* ============================================================
   AVELINA, PER SEA — poetry data + render helpers
   One source of truth for both the Writing library cards and
   the individual poem reading pages (poem.html?p=slug).
   Each poem: { title, lang, date, year, kind, text, note?, also?, related? }
   - text: stanzas separated by a blank line, lines by newline
   - also: [{ label, text }]  extra-language versions / variants shown below
   - related: [{ label, slug }]  links to related poems
   - lang: 'en' | 'ru' | 'mixed'  (drives the language filter)
   ============================================================ */
(function () {
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  // Inline interjection / commentary: wrap a phrase in ((double parens)) in the source
  // and it renders as a quiet aside — italic, ambered, set slightly apart from the verse.
  function renderLine(l) {
    var s = esc(l);
    s = s.replace(/\(\(\s*/g, '<span class="interject">').replace(/\s*\)\)/g, '</span>');
    // **highlight** a word/phrase (accent color)
    s = s.replace(/\*\*(.+?)\*\*/g, '<span class="hl">$1</span>');
    // ||spoiler|| — redacted bar, click to reveal
    s = s.replace(/\|\|(.+?)\|\|/g, '<span class="spoiler" tabindex="0" role="button" aria-label="reveal hidden line">$1</span>');
    return s;
  }
  window.renderPoemText = function (text) {
    return text.trim().split(/\n\s*\n/).map(function (st) {
      return '<p class="stanza">' + st.split(/\n/).map(function (ln) {
        // a line beginning with "> " is an echo / whispered aside
        if (/^>\s/.test(ln)) return '<span class="echo">' + renderLine(ln.replace(/^>\s/, '')) + '</span>';
        return renderLine(ln);
      }).join('<br>') + '</p>';
    }).join('');
  };

  // Curated collections. A poem belongs to a collection if its slug is listed here.
  // (Membership is editable in one place — adjust the slug lists freely.)
  window.COLLECTIONS = {
    "translations": {
      title: "Translations",
      note: "Poems carried across languages — some of mine in both directions, and one of Pushkin’s.",
      slugs: ["pushkin-georgia", "my-may", "infinity", "i-can-see-the-infinity", "umirayushchiy-soldat"]
    },
    "lilacs-ashes": {
      title: "Through Lilacs and Ashes",
      titleRu: "Сквозь сирень и пепел",
      note: "A bilingual collection — tenderness (lilacs) and loss (ashes) held together.",
      slugs: ["moy-may", "730-dney", "koshmar", "dying-soldier", "umirayushchiy-soldat",
              "beskonechnost", "infinity", "i-can-see-the-infinity", "gorit-zvezda", "odinochestvo"]
    }
  };

  window.POEMS = {

    "weavers-demise": {
      title: "Weaver's Demise", lang: "en", date: "2024", year: 2024, kind: "Poem",
      note: "The poem this section answers — a cradle, and its demise. Still unfolding.",
      text:
`For as the silkworm weaves the threads
Of the cradle where its breathing ends,
So too the poet with each line refined
May find demise in the words intertwined.

⋯

But just as silk garments have weaver's trace,
The words of the poet have gentle embrace.`
    },

    "garden-lit-in-red": {
      title: "A Garden Lit in Red", lang: "en", date: "2025", year: 2025, kind: "Poem",
      note: "A companion to the two theses \u2014 Flowers for Sale and A Garden of Women. The flowers are the women cultivated, sold, and survived by their own poison; the garden is the pleasure quarter lit in red.",
      text:
`Sweet on the tongue, yet deadly to taste\u2014
A flower that lives by the venom it faced.
They bleed where they're torn, and quietly cry.
Some beauty must poison before it can die.

They bloom and they sway, then wither one day;
Their fragrance is bought, their thorns stripped away.
They turn all their wounds into perfume and art,
The poison runs sweet in the veins of the heart.

Yet even when plucked, they refuse to decay:
Their scent haunts the garden long after the day.
Beneath all their sweetness, the bitterness grows,
A truth only one who has tasted it knows.`
    },

    "snezhnaya-deva": {
      title: "Снежная дева", lang: "ru", date: "2024", year: 2024, kind: "Poem",
      note: "Working title. A folk-inspired piece — first conceived as lyrics for a song my cousin wanted to compose, but for now it lives simply as a poem.",
      text:
`Тише… тише…
Шёпот мой слышишь?..
Тишь в глуши,
Лес стоит неподвижно…
Ну не стой же…
Иди ко мне ближе…
Тебя я не трону…
Доколе ты дышишь…

С лет юных, должно быть, учили тебя:
Коль Зиме ты поддашься — то душу губя,
Тебя в глушь заманит она, зачарует
И холодом вечным тебя околдует.
Иль правдива молва, та что ходит у люда:
Тем, кто меня встретит, приходится худо?

Иль встреча со мной — есть великое чудо?..

Ни жива, ни мертва эта снежная дева,
Ей соткан саван был под вьюги напевы.
На устах её иней, во взоре — слюда,
В очах её стынет немая вода.
На челе её из снежных кружев повойник,
Белее могильных одежд, как покойник.
Недаром в народе идёт та молва:
Что смерть таится в её словах.

Ты юноша смелый и крепкой наружности,
С тобой поделюсь я своею премудростью:
Видишь, поодаль рябина растёт?
Волшебную силу она отдаёт.
Вот алые грозди на ветвях висят,
От лютых морозов и чар защитят.
Сорви пару веток и сделай венок,
Надень на чело — он пойдёт тебе впрок.
Да сплети ты такой, чтобы был тебе впору,
И глух мигом станешь ты к моему зову…

Верить — не верить? Решай уже сам,
В этом мире нас всех поджидает обман…
Правдива ль молва, та что ходит у люда?
Тем, кто меня встретит, приходится худо?..

Иль встреча со мной — есть великое чудо?..

Ни жива, ни мертва эта снежная дева,
Ей соткан саван был под вьюги напевы.
На устах её иней, во взоре — слюда,
В очах её стынет немая вода.
На челе её из снежных кружев повойник,
Белее могильных одежд, как покойник.
Недаром в народе идёт та молва:
Что смерть таится в её словах.

Он к древу ступает, и с хрустом шагов
Всё громче становится шёпот снегов:
«Не тронь белый снег ты нагой рукой —
Он жжёт, как крапива, морозной иглой.
Он жилы скуёт и дыханье возьмёт,
И то, что в груди, вместе с теплом унесёт.

Но, может, не я тебя ныне маню,
А сердце твоё, что вверилось сну…»

Ни жив и ни мёртв этот снежный юнец,
В руках околевших — рябины венец.
Не венчанный им, он застыл наконец,
Был снегом закован в морозный ларец.
На устах его иней, во взоре — слюда,
В очах не осталось живого следа.
Он в холоде вечном нашёл свой конец:
Кто зиму полюбит — тот точно мертвец.`,
      mt:
`Hush now… hush…
Do you hear my whisper?..
Stillness in the wilds,
the forest stands unmoving…
Don't just stand there…
Come closer to me…
I won't touch you…
as long as you breathe…

Since your young years, surely, you were taught:
if you yield to Winter, you ruin your soul —
she'll lure you into the wilds, bewitch you,
and spellbind you with an eternal cold.
Or is the rumor true that runs among folk:
that it goes badly for those who meet me?

Or is meeting me a great wonder?..

Neither living nor dead is this snow maiden,
her shroud was woven to the blizzard's tunes.
On her lips is hoarfrost, in her gaze — mica,
in her eyes a mute water stiffens.
On her brow, a coif of snowy lace,
whiter than grave-clothes, like the dead.
Not for nothing the rumor runs among folk:
that death lies hidden in her words.

You're a bold youth, of sturdy build,
I'll share with you my own wisdom:
do you see, off in the distance, the rowan grows?
It gives away a magic power.
There, scarlet clusters hang from the boughs,
they'll guard you from cruel frosts and spells.
Tear off a couple of branches and make a wreath,
set it on your brow — it will do you good.
And weave it so that it fits you just right,
and in an instant you'll go deaf to my call…

To believe, or not? Decide for yourself now,
in this world a deception lies in wait for us all…
Is the rumor true that runs among folk?
That it goes badly for those who meet me?..

Or is meeting me a great wonder?..

Neither living nor dead is this snow maiden,
her shroud was woven to the blizzard's tunes.
On her lips is hoarfrost, in her gaze — mica,
in her eyes a mute water stiffens.
On her brow, a coif of snowy lace,
whiter than grave-clothes, like the dead.
Not for nothing the rumor runs among folk:
that death lies hidden in her words.

He steps toward the tree, and with the crunch of his tread
the whisper of the snows grows louder still:
"Don't touch the white snow with a bare hand —
it burns like a nettle, with a frosty needle.
It will shackle your veins and take your breath,
and bear off what's in your chest along with the warmth.

But maybe it isn't I who lure you now,
but your own heart, that has given itself to sleep…"

Neither living nor dead is this snowy youth,
in his stiffened hands — a rowan crown.
Uncrowned by it, he froze at last,
locked by the snow in a frosty casket.
On his lips is hoarfrost, in his gaze — mica,
in his eyes no living trace remains.
In the eternal cold he found his end:
whoever falls in love with winter is surely a dead man.`
    },

    "moonlit-road": {
      title: "Moonlit Road", lang: "en", date: "January 2024", year: 2024, kind: "Poem",
      note: "On a usual commute to university, accompanied by the big yellow moon and the yellow lines on the road, my playlist shuffled to “Yellow” by Coldplay. I listened once, then twice… eventually, this poem was born. The whispered lines are the moon’s echo — read past them and the poem still stands on its own.",
      text:
`The highway's double yellow lines—
> Familiar.
The moon above the green road signs—
> You see her.
Her dazzling golden gaze calls out,
> “You're like me.”
Her lonely coldness makes you doubt—
> Unlikely.

She's your companion as you drive—
> Appealing.
This late ride makes you feel alive:
> So freeing.
You try to find the light of stars.
> They're not there.
You're blinded by the beams of cars.
> They don't care.

You start to play same songs again.
> You get chills
Why suddenly you feel this pain?
> You fight tears.
It's not from sorrow, it's not sad,
> Not bitter
You realize what's left unsaid
> ||You're a quitter||`,
      also: [{
        label: "The same road, without the moon's echoes",
        text:
`The highway's double yellow lines,
The moon above the green road signs,
Her dazzling golden gaze calls out,
Her lonely coldness makes you doubt.

She's your companion as you drive,
This late ride makes you feel alive.
You try to find the light of stars,
You're blinded by the beams of cars.

You start to play same songs again.
Why suddenly you feel this pain?
It's not from sorrow, it's not sad,
You realize what's left unsaid…`
      }]
    },

    "eyes-of-stars": {
      title: "Eyes of Stars", lang: "en", date: "January 2024", year: 2024, kind: "Poem",
      note: "An experiment with an ABBA–CDDC rhyme pattern — not one I usually write in. I'm not sure I like the form, but I like the imagery.",
      text:
`When to grasp all the stars, I'll try raising my hand,
I'll find yours in the air next to mine.
I can't reach them, so you're grabbing on to their shine,
Bring the skies down for me, as I stand.

I will smile at you, standing next to the skies,
And I will realize something then:
No, I don't need these stars, I've already got them—
They reflect in the depths of your eyes.`
    },

    "moy-may": {
      title: "Мой Май", lang: "ru", date: "May 2024", year: 2024, kind: "Poem",
      related: [{ label: "My May (English translation)", slug: "my-may" }],
      text:
`Чем пахнет май? Он пахнет детством,
Тем свежим воздухом, наполненным цветами.
Сиренью, что от школы по соседству
И светлыми наивными мечтами.

Чем пахнет май теперь? Ответа я не знаю.
Я вижу вишню, что стоит в цвету,
Акации медовый вкус я вспоминаю,
Но в сердце ощущаю сквозь года тоску.

Мне пахнет тем ушедшим маем,
В котором, тогда ещё не зная,
Настал последний день,
Когда в руках держала я сирень.`
    },

    "my-may": {
      title: "My May", lang: "en", date: "May 2024", year: 2024, kind: "Translation", xlation: "from Russian",
      note: "My English translation of the Russian “Мой Май.”",
      related: [{ label: "Мой Май (Russian original)", slug: "moy-may" }],
      text:
`What May smells like? Like childhood did:
Fresh air, soft breeze, and you're a kid.
Like lilac flowers by the wall,
Like dreams that bloomed when I was small.

What does May smell like now? I cannot tell.
I see the cherry blossoms, pink and pale.
Acacia's taste still lingers on my tongue,
And deep inside, a yearning's never gone.

I miss the May that's frozen in my mind,
The one that now forever has entwined
The final day I held in both my hands
A branch of lilac from my southern lands.`
    },

    "pushkin-georgia": {
      title: "On the Hills of Georgia", lang: "en", date: "2026", year: 2026, kind: "Translation", xlation: "after Pushkin",
      note: "My English translation of Alexander Pushkin’s «На холмах Грузии лежит ночная мгла…» (1829) — not my own poem, but my rendering of his. I kept his iambic structure (hexameter on the odd lines, tetrameter on the even) and his ABABCDCD rhyme. Read “burn” and “learn” so they rhyme.",
      related: [{ label: "More translations", slug: "my-may" }],
      text:
`The shroud of night abides on Georgian hills before me,
Aragvi roars amidst this murk.
I grieve and yet feel free — my sadness soaring,
Your image in this sorrow's left to lurk.
You, only you... and nothing of my sorrow gives me pain,
No torment stings, no shadows burn.
My heart burns bright and loves anew, and this alone is plain:
to cease from love, it cannot learn.`,
      also: [{
        label: "Александр Пушкин — оригинал (1829)",
        text:
`На холмах Грузии лежит ночная мгла;
Шумит Арагва предо мною.
Мне грустно и легко; печаль моя светла;
Печаль моя полна тобою,
Тобой, одной тобой... Унынья моего
Ничто не мучит, не тревожит,
И сердце вновь горит и любит — оттого,
Что не любить оно не может.`
      }]
    },

    "730-dney": {
      title: "730 Дней", lang: "ru", date: "February 2024", year: 2024, kind: "Poem",
      text:
`Два года — семьсот тридцать дней
(без високосных февралей).
Два лета, осени, зимы
И две цветущие весны.

Два года — тысячи людей
(от пожилых и до детей),
Что после холода зимы
Не ощутят приход весны.

Два года — то не просто дата,
То жизней горькая утрата,
Два лета, осени, зимы
И две **кровавые** весны.`,
      mt:
`Two years — seven hundred and thirty days
(no leap-year Februaries counted).
Two summers, autumns, winters passed,
and two springs in full, clear bloom.

Two years — and thousands of souls
(from the elderly down to the children),
who, after the cold of winter,
will never feel the coming of spring.

Two years — this is no simple date,
but a bitter loss of lives:
two summers, autumns, winters,
and two springs that ran with **blood**.`
    },

    "heartbreak": {
      title: "Heartbreak", lang: "en", date: "November 2023", year: 2023, kind: "Poem",
      text:
`Yes, heartbreak is disease, an illness of the heart.
It eats away your soul until you fall apart.
Yes, heartbreak is disaster, your ending of the world.
And though they see you suffer, they leave without a word.
This heartbreak leaves you shambled and crushes down your soul.
It shatters all your being and makes you lose control.
Your heartbreak-poisoned mind is tortured by the thought
That love is not for you, not worth another shot.

But on the grave of dreams,
The sun will rise one morning,
Consoling with its beams,
The flowers of the mourning.`
    },

    "dying-soldier": {
      title: "Dying Soldier", lang: "en", date: "February 2019", year: 2019, kind: "Poem",
      note: "Has a Russian translation, “Умирающий Солдат,” and a song version with chords.",
      related: [{ label: "Умирающий Солдат (Russian)", slug: "umirayushchiy-soldat" }],
      text:
`I saw the pale face of Death,
I heard her breathing through the noise
Of blowing bombs which made us deaf
To cries of people who were close.

My mind was tainted by the pain,
And memories were long astray
But still, I knew, far from this bane,
Away, at home, my wife did pray.

She prayed that I'll come back alive,
That I'll embrace her and my son,
But no… The letter will arrive,
Informing them that now I'm gone…

I could no longer sense the time,
Could not distinguish day from night.
The dust and ashes hid sunshine,
The hours passed, we fiercely fight.

Who started wars, for what and why?
The world—the people want to know.
For what and why they make us die?
I'll never understand them, no.

Do they have family and friends?
The voice of conscience, hearts, and dreams?
Their greed and violence never ends,
And they are deaf to dying screams.

They are so cruel, they make mistakes,
But consequences fall on us.
We suffer, cry, and our world shakes…
Oh, we do know how mankind dies.

Yes, I do too, while lying here
I saw how Death walked over me.
She took my friend that perished near
In this abundant bloody sea.

And here I'm lying, waiting for
The same ferocious, savage fate.
I won't see home, not anymore,
And sadly here my life will fade…

How many soldiers just like me
Were in despair, ended like that?
But I am sure they became free
From wounded bodies—now they're dead.

I see the pale face of Death,
I hear her breathing through the blasts
That never ceased and made me deaf
To my own breathing now at last

I saw the pale face of Death,
Felt how she gently grabbed my soul.
Among the bombs, she caught my breath…
Before there came another blow.`
    },

    "umirayushchiy-soldat": {
      title: "Умирающий Солдат", lang: "ru", date: "April 2022", year: 2022, kind: "Translation", xlation: "from English",
      note: "A translation of “Dying Soldier.” It also has a song version with chords, and three stanzas rendered in Ukrainian.",
      related: [{ label: "Dying Soldier (English original)", slug: "dying-soldier" }],
      text:
`Я видел Смерти скорбный бледный лик.
Средь грома бомб ее дыханье слышал.
Затих людей, лежащих рядом, крик.
Мгновение — и вот они не дышат.

Мой разум болью затуманен был.
Метались мысли, и воспоминанья
Всё возвращались к тем, кто был мне мил.
К жене, что ночью молится в молчаньи.

Она все просит только об одном,
Чтоб я домой вернулся — к ней и сыну.
Но нет… День-два — грядёт беда в их дом
С письмом, что молвит о моей кончине.

Во времени потерян я давно.
Ночь ото дня не различаю вовсе,
Ведь скрыли взрывы неба полотно.
Часы стоят, мы беспробудно бьёмся.

Кто начал войны? Почему? Зачем?
Весь мир, солдаты… Люди знать желают.
За что они считают нас никем
И беспощадно, зверски убивают?

Зачинщики, есть сердце ли у вас?
Друзья? Семья, что верно ждет и любит?
Мечты? И совести живучий глас?
Им чуждо всё, они весь мир погубят.

Последствия обрушились на нас
Как эхо их жестокости, ошибок.
Страдаем, плачем в свой предсмертный час
И шаткий мир наш беспощадно зыбок.

И лёжа здесь, не раз я видел Смерть.
Как шла она, в бомб бесконечном рёве.
Вот другу помогла покинуть Твердь…
Покинуть мир и это море крови.

Я знаю, что уж близок мой конец.
Судьба моя безжалостна, сурова.
Я в мире этом больше не жилец,
Угаснет жизнь моя средь взрывов рёва.

И сколько же солдат с такой судьбой
В отчаяньи лежали, умирая?
Но под конец они, закончив бой,
Свободны стали, мир сей покидая.

Я вижу смерти скорбный бледный лик,
Средь грома бомб ее я слышу ясно
Давно затих лежащих рядом крик.
Хочу вздохнуть! Но это все напрасно

Я видел Смерти скорбный бледный лик,
Как среди бомб, просунув свои руки,
Она поймала мой последний миг,
Заботливо заканчивая муки.`,
      also: [{
        label: "Уривок українською — three stanzas in Ukrainian",
        text:
`Я бачив смерті скорботне обличчя,
Під гуркіт вибухів чув дихання її,
Але не чую більше криків ближча —
Не дихають — ось все они мертві.

✧ ✦ ✧

Я бачу смерті скорботне обличчя,
Під гуркіт зараз чую дихання її,
Давно немає більше криків ближча.
І також зникли зітхання мої.

✧ ✦ ✧

Я бачив смерті скорботне обличчя,
Нарешті ось відчув, я її руки.
Вона, до людей ставши трохи ближче,
Дбайливо зупинила мої муки.`
      }]
    },

    "infinity": {
      title: "Infinity", lang: "en", date: "November 2023", year: 2023, kind: "Translation", xlation: "from Russian",
      note: "A freer translation of the Russian “Бесконечность.” A closer one is “I Can See the Infinity.”",
      related: [{ label: "Бесконечность (Russian)", slug: "beskonechnost" }, { label: "I Can See the Infinity", slug: "i-can-see-the-infinity" }],
      text:
`I can't stop being lured
By infinity's call.
This cruel world can't be cured,
Human life is so small.
I stare in from the top
Of abyss' endless gates.
Taking terminal stop
Where eternity waits.`
    },

    "i-can-see-the-infinity": {
      title: "I Can See the Infinity", lang: "en", date: "November 2023", year: 2023, kind: "Translation", xlation: "from Russian",
      note: "A closer translation of the Russian “Бесконечность.” A freer one is “Infinity.”",
      related: [{ label: "Бесконечность (Russian)", slug: "beskonechnost" }, { label: "Infinity", slug: "infinity" }],
      text:
`I can see the infinity —
Human life is so fleeting.
I am tired of endless
Human actions, so reckless.
I will touch the infinity
And find there my eternity.
I will leave at the terminal,
Reaching out for eternal.`
    },

    "beskonechnost": {
      title: "Бесконечность", lang: "ru", date: "November 2023", year: 2023, kind: "Poem",
      note: "English versions: “Infinity” (freer) and “I Can See the Infinity” (closer).",
      related: [{ label: "Infinity", slug: "infinity" }, { label: "I Can See the Infinity", slug: "i-can-see-the-infinity" }],
      text:
`Я смотрю в бесконечность —
Моя жизнь скоротечна.
Я смотрю бесконечно
На этот мир бессердечный.
Я хочу в бесконечность —
Найти там свою вечность.
Я уйду на конечной
В этот путь бесконечный.`
    },

    "nevesta": {
      title: "Невеста", lang: "ru", date: "November 2023", year: 2023, kind: "Poem",
      text:
`Найдётся ли где-нибудь место
На этой земле, где я буду невестой,
Где меня поведут под венец,
Где увижу я блеск двух колец?

Найдётся ли кто-нибудь смелый,
Ради кого я восторженно белый
Цвет платья надену с улыбкой,
Для кого я не буду ошибкой?

Найдётся ли когда-нибудь время,
Когда забудется то тяжкое бремя
Той мысли, что меня не полюбят,
Что годами меня уже губит?

Найдётся ли где-нибудь место
На этой земле, где я буду невестой,
Где как в зеркале улыбка твоя
Будет также сиять как моя?`,
      mt:
`Is there, somewhere, a place to be found
on this earth, where I will be a bride,
where I'll be led beneath the wreath,
where I'll catch the glint of two rings?

Will there be someone brave enough,
for whose sake I would gladly put on,
smiling, the white of the dress —
someone to whom I'm not a mistake?

Will there ever come a time
when that heavy burden lifts —
the thought that I won't be loved,
the thought that, year by year, destroys me?

Is there, somewhere, a place to be found
on this earth, where I will be a bride,
where, as in a mirror, your smile
will shine as brightly as my own?`
    },

    "odinochestvo": {
      title: "Одиночество", lang: "ru", date: "November 2023", year: 2023, kind: "Poem",
      text:
`С отрочества
То пророчество,
Что всё время гласит: «Одиночество,» —
Пусть не сбудется
И забудется
Словно страшный сон хрупкой души.

Души, что плакала,
Тихо молилась
И из собственной клетки просилась,
Рискнуть жизнью,
Себе дать окрепнуть
И от слез своих не ослепнуть.

В одиночестве
Она задыхалась
От человечности своей отрекалась —
Словно кукла
С врождённым дефектом,
Но, увы, людским интеллектом.

Она знала,
Что думая так,
Она, возможно, сама себе враг.
Но быть брошенной
Было страшнее,
Для человечности то было больнее.

Её сердце —
Стеклянный сосуд.
Её руки его берегут.
Но под стекла
Разбитого звуки
Она об осколки царапала руки.

И в крови своей,
От боли дрожа,
Она собирала узор витража
Из обломков разбитого сердца.
Всё смотря на закрытую дверцу.

Умоляюще,
Со взглядом блуждающим
Она шептала душераздирающе
О пророчестве,
То что с отрочества
Непрестанно гласит: «Одиночество.»`,
      mt:
`Since girlhood,
that prophecy
forever intoning: “Solitude” —
let it not come true,
let it be forgotten
like a nightmare of a fragile soul.

A soul that wept,
that quietly prayed
and begged its way out of its own cage,
to risk a life,
to let itself grow strong
and not go blind from its own tears.

In the solitude
she was suffocating,
renouncing her own humanity —
like a doll
with a birth defect,
but, alas, with a human mind.

She knew
that, thinking so,
she might be her own worst enemy.
But to be abandoned
was more frightening,
and to her humanity, more painful still.

Her heart —
a vessel of glass.
Her hands keep it safe.
But on the shards
of the shattered glass
she scraped her hands against the splinters.

And in her own blood,
trembling with pain,
she gathered a stained-glass pattern
from the fragments of a broken heart,
all the while watching the shut door.

Pleadingly,
with a wandering gaze,
she whispered, heart-rendingly,
of the prophecy
that since girlhood
forever intones: “Solitude.”`,
      also: [{
        label: "Alternate ending",
        text:
`…Из обломков разбитого сердца.
И вдруг показалась открытою дверца.
Она вздрогнула
Словно от ветра,
И весь мир затаился в ответ ей.

Неуверенно,
Без объяснения,
Она ждала от судьбы разрешения.
Умоляюще,
Со взглядом блуждающим
Она шептала душераздирающе
О пророчестве,
То что с отрочества
Непрестанно гласит: «Одиночество.»`
      }]
    },

    "stoykost": {
      title: "Стойкость", lang: "ru", date: "November 2023", year: 2023, kind: "Poem",
      text:
`Я хотела бы стойкость,
Не взирая на робость.
Я хотела бы стойко
Голову держать бойко.
Я хочу эту стойкость
Словно супер-способность.
Неужель не стать стойкой
Вплоть до предсмертной койки?`,
      mt:
`I would like steadfastness,
in spite of my timidity.
I would like, steadfastly,
to hold my head up boldly.
I want this steadfastness
like a kind of superpower.
Can I really not grow steadfast,
right up to the deathbed?`
    },

    "koshmar": {
      title: "Кошмар 24-ого", lang: "ru", date: "February 2023", year: 2023, kind: "Poem",
      text:
`Кошмаром все казалось год назад
Тогда, в ту ночь, мне верить не хотелось,
Что где-то там всё небо загорелось.
И среди слез и всхлипов невпопад
Я представляла себе взрывов град.
Шептала, повторяла все одно:
Пролиты буду реки горьких слез,
Но верю, все пройдет до летних гроз.

Пришла весна, цветы должны цвести,
Но губят их потоки рек кровавых,
И душит их блокада оков ржавых.
Всей силой их стремятся извести,
И кажется, их больше не спасти…
Но в майские те дни молилась также.
Была уверена, злодеям хватит толку
Глаза свои открыть. И взрывы смолкнут.

Но летом также сыпались дома,
И люди без воды сидели днями,
А кто-то был без крыши под дождями,
Боясь прихода похоронного письма.
Людские жизни поглощала тьма.
И сколько же людей уже в могиле?
Прошу Господь, о дай освобожденье!
С надеждой верю, остановишь преступленье.

Настала осень. Небо полыхало.
Железный дождь бил также беспощадно.
И вражья алчность также кровожадна.
Но вера в лучшее меня не покидала.
Я по ночам молитвы все шептала.
Доколе будет эхом слышен плач
Что издают в ночи отец и мать?
Их детям взрослыми уже не стать.

Зима. Как горько, холодно и больно.
Война сердца людей опустошает,
Всё также жизни резко прекращает.
И враг с косою ходит бесконтрольно,
Он продолжает убивать всех добровольно.
Бездетна мать теперь, жена — вдова.
И режет душу детских уст ответ,
Что дрогнув скажут: «Мамы больше нет».

Кошмаром все казалось год назад
Тогда, в ту ночь, я верить не могла,
Что столько дней захватит небо мгла,
Что продолжать будут немыслимый захват,
Что целый год продлится этот ад
Февраль. Двадцать четвертое число.
И задыхаюсь я от слёз, еле дыша.
О как же сильно ты болишь, моя душа!`,
      mt:
`It all seemed a nightmare a year ago —
that night, I did not want to believe
that somewhere out there the whole sky had caught fire.
And amid the tears and the ragged sobs
I pictured to myself a hail of blasts.
I whispered, repeating the same refrain:
rivers of bitter tears will be spilled,
but I believe it will pass before the summer storms.

Spring came; the flowers are meant to bloom,
but streams of bloody rivers ruin them,
and a blockade of rusted shackles chokes them.
With all their might they strive to wipe them out,
and it seems there is no saving them now…
Yet in those May days I prayed all the same.
I was sure the villains would have the sense
to open their eyes. And the blasts would fall silent.

But in the summer, too, the houses crumbled,
and people sat for days without water,
and some were roofless under the rains,
dreading the coming of a funeral letter.
The dark devoured human lives.
And how many people are already in the grave?
I beg You, Lord, oh grant deliverance!
With hope I believe You will halt the crime.

Autumn came. The sky was ablaze.
The iron rain beat just as mercilessly.
And the enemy's greed is just as bloodthirsty.
But faith in the better did not leave me.
By night I whispered all my prayers.
How long will the weeping be heard as an echo
that a father and mother let out in the night?
Their children will never grow up now.

Winter. How bitter, how cold, how it hurts.
War lays the hearts of people waste,
and just as sharply cuts lives short.
And the enemy with his scythe walks unchecked,
he goes on killing everyone, freely.
The mother is childless now; the wife — a widow.
And the answer from children's lips cuts the soul,
the one they'll say, faltering: "Mama is gone."

It all seemed a nightmare a year ago —
that night, I could not believe
that the murk would seize the sky for so many days,
that they would go on with the unthinkable seizure,
that this hell would last a whole year.
February. The twenty-fourth.
And I am choking on tears, barely breathing.
Oh, how fiercely you ache, my soul!`
    },

    "self-love": {
      title: "Loathe to Love", lang: "en", date: "July 2019", year: 2019, kind: "Poem",
      text:
`It's hard to learn to love yourself
When people always put you down.
They judge you, laugh, and watch your breath.
They want to see how you will drown;
To see how slowly you'll be swallowed
By problems, where they left you wallowed.

It's hard to find your strength to smile
When grief and sadness always follow
And watch for you, and judge with guile
Until you're hopeless, left in sorrow.
But one day, surely, you will rise,
Forgetting all those lies and cries.

Oh, you'll be like a blooming rose
That was abused once, back in past,
But you have grown your thorns and claws,
And now you'll never be harassed!
Your scars will be that part of you
Which would define what you've come through.

And you'll love others like yourself
Because you now will not have fear
That you will not have enough strength
While you'll withstand sad things you hear.
This won't harm you because you'll know
That it's not true and you will glow.

You'll show your talent, value, worth.
You will be smiling then with mirth!
And people, trying reach your stem,
Will gently treat you like a gem.
While reaching you, they will avoid
Your thorns that eas'ly can them hurt.

But you will glance without gloom
And they will wait for you to bloom!`
    },

    "proverbs": {
      title: "Proverbs 18:2", lang: "en", date: "July 2023", year: 2023, kind: "Poem",
      note: "An absurdist metaphor meant to pass a message, passively, to someone who behaved like a fool. Too bad they probably won't get that.",
      text:
`**P**ine trees were standing in the snow
**R**ight in the middle of July—
**O**h, wait, that's not how it should go!
**V**iewpoint my was in the sky.
**E**nding my gaze up on a cloud.
**R**ight now I'm thinking the math through
**B**ecause it is, without a doubt,
**S**uch simple fraction,
**18** by
**2**`
    },

    "gorit-zvezda": {
      title: "Горит Звезда", lang: "ru", date: "June 2016", year: 2016, kind: "Poem",
      text:
`Горит звезда. Звезда — одна.
Уж скор её конец.
Горит звезда. Звезда — бледна.
Ведь так решил Творец.

Ничто невечно под луной,
Ничто — под звёздами в ночи.
Не правит мир своей судьбой,
Как свет потушенной свечи.

Звезда горит в последний раз,
Последний час, последний миг.
А дальше — тьма закрытых глаз.
Звезды уж не сияет лик.

Последний вздох свой издавая,
Хотела всё вернуть назад.
И имя Бога призывая,
Кричала что-то невпопад.

Но поздно, ничего не изменить —
И за грехи приходит час расплаты.
За каждый миг должны благодарить,
Ведь мы в своих страданьях виноваты.

Одни живут лишь по Завету,
Другие — грязно, жалко, лживно.
Одни, как звёзды — дети света.
Другие меркнут же стыдливо.

И звёзды меркнут и горят:
Одни живут, перерождаясь,
Живут, всё больше свет даря,
Другие гибнут, заблуждаясь.

Они живут и смерть приносят,
Чернеют и несут беду.
И рану сердцу их наносят,
С грехом связав свою судьбу.

Черна дыра. Дыра черна —
Загадка, тайна, смерть.
Черна дыра. Дыра темна.
Ей больше не гореть.

И происходит так с людьми:
Одни в жизнь Вечную идут,
Другие в царство вечной тьмы —
Туда, какой путь изберут.`,
      mt:
`A star is burning. The star is alone.
Its end is coming soon.
A star is burning. The star is pale —
for so the Creator willed.

Nothing is eternal under the moon,
nothing — beneath the stars at night.
The world does not rule its own fate,
like the light of a candle put out.

The star burns for the final time,
the final hour, the final instant.
And beyond — the dark of shut eyes.
The star's face shines no more.

Breathing out its final breath,
it longed to turn it all back,
and, calling on the name of God,
it cried out something astray.

But too late — nothing can be changed,
and for our sins the reckoning comes.
For every moment we should give thanks,
for in our sufferings we're to blame.

Some live only by the Covenant;
others — foul, pitiful, false.
Some, like stars, are children of light.
Others gutter out in shame.

And the stars dim, and the stars burn:
some live on, being reborn,
living, giving ever more light;
others perish, led astray.

They live, and they bring death,
they blacken and carry woe,
and they wound their own heart,
binding their fate to sin.

A black hole. The hole is black —
a riddle, a secret, death.
A black hole. The hole is dark.
It will burn no more.

And so it goes with people too:
some pass into Life Eternal,
others into the realm of endless dark —
there, by whichever path they choose.`
    },

    "glubina": {
      title: "Глубина", lang: "ru", date: "January 2016", year: 2016, kind: "Poem",
      text:
`Глубина, покой и море.
Глубина, утрата, горе.
Глубина — загадка века
И конец для человека.

Непостижима для меня,
И необъятна для тебя.
Потопит, а потом забудет,
Искать другую жертву будет.

Она коварна, беспощадна.
И ведь не рядом, далека.
Тиха, прекрасна, ненаглядна
И в то же время так близка.`,
      mt:
`The deep: stillness, and the sea.
The deep: loss, and grief.
The deep — the riddle of the age,
and the end of a human life.

Unfathomable to me,
and boundless to you.
It drowns you, then forgets,
and goes to seek another prey.

It is treacherous, merciless,
and not near — it is far away.
Quiet, lovely, beyond looking away,
and at the very same time, so close.`
    },

    "chego-ty-zhdyosh": {
      title: "Чего Ты Ждёшь?", lang: "ru", date: "January 2016", year: 2016, kind: "Poem",
      text:
`Чего ты ждешь? Куда бежишь?
Зачем? Откуда? Почему?
Забыть всё прошлое спешишь,
Молча стоишь,
И никому,
На сердце что, не говоришь.
Тебе уже понять нельзя,
Что жизнь закончилась не зря.`,
      mt:
`What are you waiting for? Where do you run?
What for? From where? And why?
You hurry to forget the whole past,
you stand in silence,
and to no one
do you speak of what's on your heart.
It is no longer yours to understand
that life has ended not in vain.`
    }

  };

  window.POEM_ORDER = [
    "weavers-demise", "garden-lit-in-red",
    "snezhnaya-deva", "moonlit-road", "eyes-of-stars", "moy-may", "my-may", "730-dney",
    "heartbreak", "dying-soldier", "umirayushchiy-soldat", "infinity", "i-can-see-the-infinity",
    "beskonechnost", "nevesta", "odinochestvo", "stoykost", "koshmar",
    "self-love", "proverbs", "pushkin-georgia", "gorit-zvezda", "glubina", "chego-ty-zhdyosh"
  ];
})();
