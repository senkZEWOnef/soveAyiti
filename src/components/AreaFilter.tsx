'use client'

import { useMemo, useState } from 'react'

export interface Area {
  dept: string
  name: string
}

// Department + commune/district selects for the candidate filter. The commune list follows the chosen
// department, and a commune that does not belong to it is dropped, so the filter can never select an empty combination.
export default function AreaFilter({
  departments,
  areas,
  initialDept,
  initialArea,
  labels,
  selectClass,
}: {
  departments: string[]
  areas: Area[]
  initialDept: string
  initialArea: string
  labels: { department: string; allDepartments: string; locality: string; allLocalities: string }
  selectClass: string
}) {
  const [dept, setDept] = useState(initialDept)
  const [area, setArea] = useState(initialArea)
  const options = useMemo(() => areas.filter((a) => !dept || a.dept === dept), [areas, dept])
  const label = 'text-xs font-semibold uppercase tracking-wide text-navy-600'

  return (
    <>
      <label className={label}>
        {labels.department}
        <select
          name="dept"
          value={dept}
          onChange={(e) => {
            setDept(e.target.value)
            if (e.target.value && !areas.some((a) => a.dept === e.target.value && a.name === area)) setArea('')
          }}
          className={`${selectClass} mt-1 normal-case`}
        >
          <option value="">{labels.allDepartments}</option>
          {departments.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </label>
      {areas.length > 0 && (
        <label className={label}>
          {labels.locality}
          <select name="loc" value={area} onChange={(e) => setArea(e.target.value)} className={`${selectClass} mt-1 normal-case`}>
            <option value="">{labels.allLocalities}</option>
            {options.map((a) => (
              <option key={`${a.dept}/${a.name}`} value={a.name}>{dept ? a.name : `${a.name} (${a.dept})`}</option>
            ))}
          </select>
        </label>
      )}
    </>
  )
}
