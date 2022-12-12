# Essential Stuff

## Html import links

Google font

``` html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&family=Forum&display=swap" rel="stylesheet">
```

Ionicon

``` html
<script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"></script>
<script nomodule src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"></script>
```

---

## Colors

``` css
--gold-crayola: hsl(38, 61%, 73%);
--quick-silver: hsla(0, 0%, 65%, 1);
--davys-grey: hsla(30, 3%, 34%, 1);
--smoky-black-1: hsla(40, 12%, 5%, 1);
--smoky-black-2: hsla(30, 8%, 5%, 1);
--smoky-black-3: hsla(0, 3%, 7%, 1);
--eerie-black-1: hsla(210, 4%, 9%, 1);
--eerie-black-2: hsla(210, 4%, 11%, 1);
--eerie-black-3: hsla(180, 2%, 8%, 1);
--eerie-black-4: hsla(0, 0%, 13%, 1);
--white: hsla(0, 0%, 100%, 1);
--white-alpha-20: hsla(0, 0%, 100%, 0.2);
--white-alpha-10: hsla(0, 0%, 100%, 0.1);
--black: hsla(0, 0%, 0%, 1);
--black-alpha-80: hsla(0, 0%, 0%, 0.8);
--black-alpha-15: hsla(0, 0%, 0%, 0.15);
```

## Gradient color

``` css
--loading-text-gradient: linear-gradient(90deg, transparent 0% 16.66%, var(--smoky-black-3) 33.33% 50%,  transparent 66.66% 75%);
--gradient-1: linear-gradient(to top,hsla(0, 0%, 0%, 0.9),hsla(0, 0%, 0%, 0.7),transparent);
```

## Typography

``` css
--fontFamily-forum: 'Forum', cursive;
--fontFamily-dm_sans: 'DM Sans', sans-serif;

--fontSize-display-1: calc(1.3rem + 6.7vw);
--fontSize-headline-1: calc(2rem + 2.5vw);
--fontSize-headline-2: calc(1.3rem + 2.4vw);
--fontSize-title-1: calc(1.6rem + 1.2vw);
--fontSize-title-2: 2.2rem;
--fontSize-title-3: 2.1rem;
--fontSize-title-4: calc(1.6rem + 1.2vw);
--fontSize-body-1: 2.4rem;
--fontSize-body-2: 1.6rem;
--fontSize-body-3: 1.8rem;
--fontSize-body-4: 1.6rem;
--fontSize-label-1: 1.4rem;
--fontSize-label-2: 1.2rem;

--weight-regular: 400;
--weight-bold: 700;

--lineHeight-1: 1em;
--lineHeight-2: 1.2em;
--lineHeight-3: 1.5em;
--lineHeight-4: 1.6em;
--lineHeight-5: 1.85em;
--lineHeight-6: 1.4em;

--letterSpacing-1: 0.15em;
--letterSpacing-2: 0.4em;
--letterSpacing-3: 0.2em;
--letterSpacing-4: 0.3em;
--letterSpacing-5: 3px;
```

## Spacing

``` css
--section-space: 70px;
```

## Shadow

``` css
--shadow-1: 0px 0px 25px 0px hsla(0, 0%, 0%, 0.25);
```

## Border Radius

``` css
--radius-24: 24px;
--radius-circle: 50%;
```

## Transition

``` css
--transition-1: 250ms ease;
--transition-2: 500ms ease;
--transition-3: 1000ms ease;
```
