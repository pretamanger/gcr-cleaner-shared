import React from 'react'
import { render } from '@testing-library/react'

import { Loader } from './Loader'

describe('<Loader />', () => {
  let result

  beforeEach(() => {
    result = render(<Loader />)
  })

  test('should have expected className', () => {
    const { queryByTestId } = result
    const loader = queryByTestId('loader')

    expect(loader).toBeInTheDocument()
    expect(loader).toHaveAttribute('class', 'Loader')
  })
})
