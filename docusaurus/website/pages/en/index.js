/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

class HomeSplash extends React.Component {
  render() {
    const { siteConfig, language = '' } = this.props;
    const { baseUrl, docsUrl } = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

    const SplashContainer = props => (
      <div className='homeContainer'>
        <div className='homeSplashFade'>
          <div className='wrapper homeWrapper'>{props.children}</div>
        </div>
      </div>
    );

    const Logo = props => (
      <div className='projectLogo'>
        <img src={props.img_src} alt='Project Logo' />
      </div>
    );

    const ProjectTitle = () => (
      <h2 className='projectTitle'>
        {siteConfig.title}
        <small>{siteConfig.tagline}</small>
      </h2>
    );

    const PromoSection = props => (
      <div className='section promoSection'>
        <div className='promoRow'>
          <div className='pluginRowBlock'>{props.children}</div>
        </div>
      </div>
    );

    const Button = props => (
      <div className='pluginWrapper buttonWrapper'>
        <a className='button' href={props.href} target={props.target}>
          {props.children}
        </a>
      </div>
    );

    return (
      <SplashContainer>
        <Logo img_src={`${baseUrl}img/undraw_monitor.svg`} />
        <div className='inner'>
          <ProjectTitle siteConfig={siteConfig} />
          <PromoSection>
            <Button href='#try'>Try It Out</Button>
            <Button href={docUrl('doc1.html')}>Example Link</Button>
            <Button href={docUrl('doc2.html')}>Example Link 2</Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

class Index extends React.Component {
  render() {
    const { config: siteConfig, language = '' } = this.props;
    const { baseUrl } = siteConfig;

    const Block = props => (
      <Container padding={['bottom', 'top']} id={props.id} background={props.background}>
        <GridBlock align='center' contents={props.children} layout={props.layout} />
      </Container>
    );

    const TryOut = () => (
      <Block id='try'>
        {[
          {
            content:
              'To make your landing page more attractive, use illustrations! Check out ' +
              '[**unDraw**](https://undraw.co/) which provides you with customizable illustrations which are free to use. ' +
              'The illustrations you see on this page are from unDraw.',
            image: `${baseUrl}img/undraw_code_review.svg`,
            imageAlign: 'left',
            title: 'Wonderful SVG Illustrations'
          }
        ]}
      </Block>
    );

    const LearnHow = () => (
      <Block background='light'>
        {[
          {
            content: 'Each new Docusaurus project has **randomly-generated** theme colors.',
            image: `${baseUrl}img/undraw_youtube_tutorial.svg`,
            imageAlign: 'right',
            title: 'Randomly Generated Theme Colors'
          }
        ]}
      </Block>
    );

    const Features = () => (
      <Block layout='fourColumn'>
        {[
          {
            image: `${baseUrl}img/cron.png`,
            imageAlign: 'top',
            title: 'Scraping with CronJob'
          },
          {
            image: `${baseUrl}img/person.png`,
            imageAlign: 'top',
            title: 'Exec scraping in Line Command'
          },
          {
            image: `${baseUrl}img/docker.png`,
            imageAlign: 'top',
            title: 'Docker Image with environment variables in Dockerhub'
          },
          {
            image: `${baseUrl}img/computer.png`,
            imageAlign: 'top',
            title: 'Scraping in ServerSide and ClientSide'
          }
        ]}
      </Block>
    );

    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className='mainContainer'>
          <Features />
          <LearnHow />
          <TryOut />
        </div>
      </div>
    );
  }
}

module.exports = Index;
