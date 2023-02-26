import express, { Router } from 'express';
import { createServer } from 'vite';
import { HtmlRenderer, devRender, prodRender } from './ssr/htmlRenderer';
import { createCacheMiddleware } from '../utils/cacheMiddleware';
import * as process from 'process';
import { createCspMiddleware } from '../utils/cspMiddleware';

const assetsDir = `${process.cwd()}/dist/client/assets`;

const isProd = process.env.NODE_ENV !== 'development';

export const registerSiteRoutes = async (router: Router) => {
    let render: HtmlRenderer;

    if (isProd) {
        console.log('Configuring site endpoints for production mode');

        router.use(
            '/assets',
            express.static(assetsDir, {
                maxAge: '1y',
                index: 'false',
            })
        );

        render = prodRender;
    } else {
        console.log('Configuring site endpoints for development mode');

        const vite = await createServer({
            server: { middlewareMode: true },
            appType: 'custom',
            root: '../',
            base: process.env.APP_BASE_PATH,
        });

        router.use(vite.middlewares);

        render = devRender(vite);
    }

    router.use(
        '*',
        createCacheMiddleware({ ttlSec: 600, maxSize: 2 }),
        await createCspMiddleware()
    );

    router.get('/', async (req, res) => {
        const html = await render('/');
        return res.status(200).send(html);
    });
};
