import React from 'react'

import LoadingOverlay from 'react-loading-overlay'

import styled from 'styled-components'

import Loading from './Loading'

const StyledLoader = styled(LoadingOverlay)`
  overflow: hidden;

  ._loading_overlay_overlay {
    background: rgba(255, 255, 255, 0.5);
  }
  &._loading_overlay_wrapper--active {
    overflow: hidden;
  }
`

function MyLoadingOvelay(props) {
  return (
    <StyledLoader
      fadeSpeed={250}
      active={props.isLoading}
      spinner={<Loading />}
    >
      {props.children}
    </StyledLoader>
  )
}

export default MyLoadingOvelay
