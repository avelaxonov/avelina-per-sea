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
    return s;
  }
  window.renderPoemText = function (text) {
    return text.trim().split(/\n\s*\n/).map(function (st) {
      return '<p class="stanza">' + st.split(/\n/).map(renderLine).join('<br>') + '</p>';
    }).join('');
  };

  // Curated collections. A poem belongs to a collection if its slug is listed here.
  // (Membership is editable in one place — adjust the slug lists freely.)
  window.COLLECTIONS = {
    "lilacs-ashes": {
      title: "Through Lilacs and Ashes",
      titleRu: "Сквозь сирень и пепел",
      note: "A bilingual collection — tenderness (lilacs) and loss (ashes) held together.",
      slugs: ["moy-may", "730-dney", "koshmar", "dying-soldier", "umirayushchiy-soldat",
              "beskonechnost", "infinity", "i-can-see-the-infinity", "gorit-zvezda", "odinochestvo"]
    }
  };

  window.POEMS = {

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
Кто зиму полюбит — тот точно мертвец.

тише… тише…
шёпот мой слышишь…

кто зиму полюбит…
тот точно мертвец…

тише… тише…
иди ко мне ближе…

кто зиму полюбит…
тот точно мертвец…

тише… тише…
шёпот мой слышишь…`
    },

    "moonlit-road": {
      title: "Moonlit Road", lang: "en", date: "January 2024", year: 2024, kind: "Poem",
      note: "On a usual commute to university, accompanied by the big yellow moon and the yellow lines on the road, my playlist shuffled to “Yellow” by Coldplay. I listened once, then twice… eventually, this poem was born.",
      text:
`The highway's double yellow lines,
The moon above the green road signs,
Her dazzling golden gaze calls out,
Her lonely coldness makes you doubt.

She's your companion as you drive.
This late ride makes you feel alive.
You search the sky to see the stars.
You're blinded by the beams of cars.

You start to play same songs again.
Why do you feel this throbbing pain?
It's not a sorrow. It's not sad,
Realization drives you mad—`
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
      title: "Мой Май", lang: "mixed", date: "May 2024", year: 2024, kind: "Poem",
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
Когда в руках держала я сирень.`,
      also: [{
        label: "English — “My May”",
        text:
`What does May smell like? Like childhood near,
Fresh air, soft winds, and flowers drawing near.
Like lilac trees that bloomed by my old school,
And dreams that bloomed in me when I was small.

What does May smell like now? I cannot tell.
I see the cherry blossoms, pink and pale.
Acacia's taste still lingers on my tongue—
But deep inside, a yearning's never gone.

I miss the May I used to know so well—
When I, not knowing, bid it one farewell:
The final day I held in both my hands
A branch of lilac from my southern lands.`
      }]
    },

    "730-dney": {
      title: "730 Дней", lang: "ru", date: "February 2024", year: 2024, kind: "Poem",
      text:
`Два года — семьсот тридцать дней
(без високосных февралей)?
Два лета, осени, зимы
И две цветущие весны.

Два года — тысячи людей
(от пожилых и до детей),
Что после холода зимы
Не ощутят приход весны.

Два года — то не просто дата,
То жизней горькая утрата,
Два лета, осени, зимы
И две кровавые весны.`
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
      title: "Умирающий Солдат", lang: "ru", date: "April 2022", year: 2022, kind: "Poem",
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

Я бачу смерті скорботне обличчя,
Під гуркіт зараз чую дихання її,
Давно немає більше криків ближча.
І також зникли зітхання мої.

Я бачив смерті скорботне обличчя,
Нарешті ось відчув, я її руки.
Вона, до людей ставши трохи ближче,
Дбайливо зупинила мої муки.`
      }]
    },

    "infinity": {
      title: "Infinity", lang: "en", date: "November 2023", year: 2023, kind: "Poem",
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
      title: "I Can See the Infinity", lang: "en", date: "November 2023", year: 2023, kind: "Poem",
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
Будет также сиять как моя?`
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
Вплоть до предсмертной койки?`
    },

    "koshmar": {
      title: "Кошмар 24-ого", lang: "ru", date: "February 2023", year: 2023, kind: "Poem",
      note: "A condensed English rendering, “Nightmare of the 24th,” also exists.",
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
О как же сильно ты болишь, моя душа!`
    },

    "self-love": {
      title: "Self-Love", lang: "en", date: "July 2019", year: 2019, kind: "Poem",
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
`Pine trees were standing in the snow
Right in the middle of July—
Oh, wait, that's not how it should go!
Viewpoint my was in the sky.

Ending my gaze up on a cloud.
Right now I'm thinking the math through
Because it is, without a doubt,
Such simple fraction,
18:2`
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
Туда, какой путь изберут.`
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
И в то же время так близка.`
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
Что жизнь закончилась не зря.`
    }

  };

  window.POEM_ORDER = [
    "snezhnaya-deva", "moonlit-road", "eyes-of-stars", "moy-may", "730-dney",
    "heartbreak", "dying-soldier", "umirayushchiy-soldat", "infinity", "i-can-see-the-infinity",
    "beskonechnost", "nevesta", "odinochestvo", "stoykost", "koshmar",
    "self-love", "proverbs", "gorit-zvezda", "glubina", "chego-ty-zhdyosh"
  ];
})();
