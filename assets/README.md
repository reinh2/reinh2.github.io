# Материалы Reinh

## Используются на сайте

- `reinh-wordmark-plain.svg` - логотип в шапке и подвале.
- `reinh-mark-dark.svg` - знак R в блоке контактов (только на тёмном фоне).
- `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png` и `../favicon.ico` - иконки сайта.
- `og-reinh-ru-1200x630.png`, `og-reinh-en-1200x630.png` - превью ссылки для соцсетей и мессенджеров.
- `motion/<проект>-<язык>.mp4` - видеообзоры проектов, 1920×1080.
- `motion/<проект>-<язык>-720.mp4` - те же видео в 1280×720 для экранов до 700 px. Получены из полных версий:
  `ffmpeg -i lead-ru.mp4 -vf scale=1280:720:flags=lanczos -c:v libx264 -preset slow -crf 25 -c:a aac -b:a 96k -movflags +faststart lead-ru-720.mp4`
- `motion/<проект>-<язык>-poster.webp` - первый кадр видео (WebP, качество 82).
- `lead-pipeline-demo.mp4` - полная запись демо Lead Pipeline.
- `icons/` - исходники иконок. На сайте они встроены в `site.css` как SVG-маски.

## Фирменный набор

- `reinh-wordmark-light.svg`, `reinh-wordmark-dark.svg`, `reinh-wordmark-mono.svg` - прозрачные SVG с буквами в контурах и Checkpoint: один поворот, один квадрат. Шрифт не нужен. Если мотив уже есть в композиции, скрыть группу `checkpoint`, оставив `wordmark`. Dark-версия - только на тёмном фоне. В шапке сайта ширина от 88 CSS px; для favicon - R.
- `reinh-mark-light.svg` - знак R для светлого фона.
- `reinh-avatar-512.png`, `reinh-avatar.svg` - квадратный аватар под круговое кадрирование.
- `reinh-tokens.json` - цвета, шрифты и размеры в машиночитаемом виде.

Растровые обложки кейсов, исходные скриншоты и крупные PNG знака R удалены из репозитория, потому что сайт их больше не использует. Их можно вернуть из истории git (коммит `e27162f`).
