import React, {PropTypes} from 'react'
import SortDirection from './sortDirection'
import cn from 'classnames'

export default function SortIndicator ({ sortDirection }) {

  const classNames = cn('sortHeader', {
    'sortHeader--ASC': sortDirection === SortDirection.ASC,
    'sortHeader--DESC': sortDirection === SortDirection.DESC
  })

  console.log(SortDirection)
  return (
    <svg
      className={classNames}
      width={18}
      height={18}
      viewBox='0 0 24 24'
    >
      {sortDirection === SortDirection.ASC
        ? <path d='M7 14l5-5 5 5z'/>
        : <path d='M7 10l5 5 5-5z'/>
      }
      <path d='M0 0h24v24H0z' fill='none'/>
    </svg>
  )
}

SortIndicator.propTypes = {
  sortDirection: PropTypes.oneOf([ SortDirection.ASC, SortDirection.DESC ])
}

