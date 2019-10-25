import React from 'react'
import styled from 'styled-components'
import FeatureCard from './FeatureCard'
import {Flex} from 'rebass'
import rectangles from '../../images/background-rectangles.svg'
import terminalIcon from '../../images/terminal-icon.svg'
import networkIcon from '../../images/network-icon.svg'
import managerIcon from '../../images/manager-icon.svg'

const ContainerInner = styled(Flex)`
  background: linear-gradient(84deg, #fb881799, #ff4b0199, #c1212799, #e02aff99);
`

const Container = styled.div`
  background: top / cover no-repeat url(${rectangles});
`

const ContentWrapper = styled(Flex)`
  max-width: 640px;
`

const featureTexts = {
  textOne: 'Nunc malesuada suscipit enim at feugiat. Duis id mauris lectus. Donec a sagittis lectus.',
  textTwo: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod Lorem ipsum dolor sit amet, tetuer adipiscing elit, sed diam nonummy nibmod'
}

const featureTitles = {
  titleOne: 'Really Fast',
  titleTwo: 'Easy to Use'
}

const Features = () => {
  return (
    <Container>
      <ContainerInner>
        <ContentWrapper m='auto' py={5} flexDirection='column'>
          <FeatureCard
            icon={terminalIcon}
            title={featureTitles.titleOne}
            text={featureTexts.textOne}
          />
          <FeatureCard
            icon={managerIcon}
            title={featureTitles.titleTwo}
            text={featureTexts.textTwo}
          />
          <FeatureCard
            icon={networkIcon}
            title={featureTitles.titleOne}
            text={featureTexts.textOne}
          />
        </ContentWrapper>
      </ContainerInner>
    </Container>
  )
}

export default Features
