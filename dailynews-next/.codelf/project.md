## {Project Name} (init from readme/docs)

> {Project Description}

> {Project Purpose}

> {Project Status}

> {Project Team}

> {Framework/language/other(you think it is important to know)}



## Dependencies (init from programming language specification like package.json, requirements.txt, etc.)

* package1 (version): simple description
* package2 (version): simple description


## Development Environment

> include all the tools and environments needed to run the project
> makefile introduction (if exists)


## Structrue (init from project tree)

> It is essential to consistently refine the analysis down to the file level — this level of granularity is of utmost importance.

> If the number of files is too large, you should at least list all the directories, and provide comments for the parts you consider particularly important.

> In the code block below, add comments to the directories/files to explain their functionality and usage scenarios.

> if you think the directory/file is not important, you can not skip it, just add a simple comment to it.

> but if you think the directory/file is important, you should read the files and add more detail comments on it (e.g. add comments on the functions, classes, and variables. explain the functionality and usage scenarios. write the importance of the directory/file).
```
root
- .eslintrc.json
- .gitignore
- .next
- .npmrc
- DATA_RECOVERY.md
- DEPLOY.md
- PROJECT_SUMMARY.md
- QUICKSTART.md
- README.md
- START_HERE.md
- TROUBLESHOOTING.md
- VERCEL_ENV_FIX.md
- app
    - api
        - crawler
            - route.ts
        - news
            - [date]
                - route.ts
            - route.ts
        - stats
            - route.ts
    - archive
        - page.tsx
    - components
        - AnimatedBackground.tsx
    - globals.css
    - layout.tsx
    - news
        - [date]
            - page.tsx
    - page.tsx
    - robots.txt
        - route.ts
    - sitemap.ts
- lib
    - animations.ts
    - crawler.ts
    - db.ts
    - useAnimations.ts
- middleware.ts
- next.config.js
- package-lock.json
- package.json
- public
    - favicon.ico
- scripts
    - batch-crawl.js
    - import-old-data.js
    - migrate.js
    - setup-vercel-env.sh
- tsconfig.json
- vercel.json
```
