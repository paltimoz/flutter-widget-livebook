import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { MDXProvider } from "@mdx-js/react";
import ReactDisqusComments from 'react-disqus-comments';
import * as toc from 'markdown-toc';

import { PageScroll, Code, CodeExample } from "../../components";
import siteConfig from '../../site.config';
import siteConfing from "../../site.config";

import './LayoutContent.module.scss'

const getEditUrl = (pathname) => {
  const gitHubRepoUrl = siteConfig.metadata.githubRepoUrl;
  const docPath = `pages${pathname}.mdx`;

  return `${gitHubRepoUrl}/blob/master/${docPath}`;
};

const preToCodeBlock = preProps => {
  if (
    // children is code element
    preProps.children &&
    // code props
    preProps.children.props &&
    // if children is actually a <code>
    preProps.children.props.mdxType === "code"
  ) {
    // we have a <pre><code> situation
    const {
      children: codeString,
      className = "",
      ...props
    } = preProps.children.props;

    const match = className.match(/language-([\0-\uFFFF]*)/);

    return {
      codeString: codeString.trim(),
      className,
      language: match != null ? match[1] : "",
      ...props
    };
  }
  return undefined;
};

const components = {
  wrapper: props => {
    const { frontMatter, tableOfContents } = props;
    const router = useRouter();

    const tocTree = [];
    for (let i = 0; i < tableOfContents.length; i++) {
      const element = tableOfContents[i];
      if (element.lvl == 2) {
        tocTree.push(Object.assign(
          element, {
            children: [],
          }
        ));
      } else if (element.lvl == 3) {
        if (tocTree[tocTree.length - 1]) {
          tocTree[tocTree.length - 1].children.push(element);
        }
      }
    }

    let keywords = [
      'Flutter',
      'Flutter Widget',
      'Flutter Widget Livebook',
      'Flutter Widget Example',
      'Flutter Widget Sample',
    ];
    if (router.pathname.indexOf('/widgets/') >= 0) {
      keywords = [
        `Flutter ${frontMatter.title} Example`,
        `Flutter ${frontMatter.title} Sample`,
        `${frontMatter.title} Example`,
        `${frontMatter.title} Sample`,
      ]
    }

    return (
      <div className="content">
        <Head>
          <title>
            {frontMatter.title}
            {frontMatter.title ? " | " : ""}Flutter Widget Livebook
          </title>
          <meta charSet="utf-8" />
          <meta name="description" content={`${frontMatter.title}${frontMatter.title ? " | " : ""}Flutter Widget Livebook`} />
          <meta name="keywords" content={keywords.join(',')} />
          <meta name="author" content="LiJianying<lijy91@foxmail.com>" />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <>
          <div className={"page-content-list-wrapper"}>
            <ol className={"page-content-list"}>
              <a
                href={siteConfing.metadata.chromePluginUrl}
                style={{
                  marginTop: '-40px',
                  display: 'flex',
                }}
              >
                <img
                  src="/images/ChromeWebStore_BadgeWBorder_v2_496x150.png"
                  style={{
                    width: '250px',
                    height: '76px',
                  }}
                />
              </a>
              {(tocTree || []).length === 0 ? null : <h4>Table of contents</h4>}
              {(tocTree || []).map(item => (
                <li key={item.slug}>
                  <Link href={`#${item.slug}`}>{item.content}</Link>
                  {
                    item.children.length === 0 ? null : <ul>
                      {(item.children || []).map(childItem => (
                        <li key={childItem.slug}>
                          <Link href={`#${childItem.slug}`}>{childItem.content}</Link>
                        </li>
                      ))}
                    </ul>
                  }
                </li>
              ))}
              <div
                style={{
                  marginTop: '30px',
                  minHeight: '144px',
                }}
                ref={el => {
                  if (!el || typeof window === 'undefined' || window.innerWidth < 1400) return;
                  if (el.children.length > 0) return;

                  let s = document.createElement("script");
                  s.src = "//cdn.carbonads.com/carbon.js?serve=CKYIT23U&placement=blankapporg";
                  s.setAttribute("id", "_carbonads_js");
                  s.async = true;

                  el.appendChild(s);
                }}
              />
            </ol>
          </div>
          <>
            <h1>{frontMatter.title}</h1>
            <p>
              <a className="edit-link" href={getEditUrl(router.pathname)} target="_blank" rel="noopener noreferrer">
                Edit this page
              </a>
            </p>
            <div
              ref={el => {
                if (!el || typeof window === 'undefined' || window.innerWidth >= 1400) return;
                if (el.children.length > 0) return;

                let s = document.createElement("script");
                s.src = "//cdn.carbonads.com/carbon.js?serve=CKYIT23U&placement=blankapporg";
                s.setAttribute("id", "_carbonads_js");
                s.async = true;

                el.appendChild(s);
              }}
            />
            <div {...props} />
            <ReactDisqusComments
              shortname={siteConfig.disqus.shortname}
              url={`${siteConfig.metadata.homepageUrl}/${router.pathname}`}
              identifier={frontMatter.id || (router.pathname)}
              title={frontMatter.title}
            />
          </>
        </>
      </div>
    );
  },
  h2: props => {
    const slug = toc.slugify(props.children)
    return (
      <>
        <a id={slug} href={`#${slug}`}></a>
        <h2 {...props} />
      </>
    )
  },
  h3: props => {
    const slug = toc.slugify(props.children)
    return (
      <>
        <a id={slug} href={`#${slug}`}></a>
        <h3 {...props} />
      </>
    )
  },
  h4: props => {
    const slug = toc.slugify(props.children)
    return (
      <>
        <a id={slug} href={`#${slug}`}></a>
        <h4 {...props} />
      </>
    )
  },
  h5: props => {
    const slug = toc.slugify(props.children)
    return (
      <>
        <a id={slug} href={`#${slug}`}></a>
        <h5 {...props} />
      </>
    )
  },
  pre: props => {
    let codeProps = preToCodeBlock(props);

    if (codeProps.liveslice) {
      return (
        <CodeExample
          data={[
            {
              codeProps: codeProps,
              content: (
                <div
                  style={{
                    width: '100%',
                    minHeight: '260px',
                  }}
                >
                  <iframe
                    className="livesample"
                    style={{
                      width: '100%',
                      height: '260px',
                      ...(codeProps.height ? { height: codeProps.height } : {})
                    }}
                    src={`https://flutter-widget-livebook-uiexplorer.blankapp.org/#/Slice${codeProps.liveslice}`}
                    scrolling="no"
                  />
                </div>
              ),
            }
          ]}
        />
      );
    }
    return <Code {...codeProps} />;
  },
  inlineCode: props => {
    if (props.children.indexOf('youtube:') >= 0) {
      return (
        <div
          className="video-container"
          style={{
            maxWidth: '768px',
            height: '432px',
          }}
        >
          <iframe
            width="100%"
            height="100%"
            src={`${props.children.replace('youtube: https://youtu.be/', 'https://www.youtube.com/embed/')}?rel=0`}
          ></iframe>
        </div>
      )
    }
    return <p><code {...props} /></p>;
  }
};

const LayoutContent = ({ children }) => {
  const router = useRouter();
  return (
    <PageScroll key={router.pathname}>
      <MDXProvider components={components}>{children}</MDXProvider>
    </PageScroll>
  );
};

export default LayoutContent;
