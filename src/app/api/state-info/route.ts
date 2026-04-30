/**
 * State Information API Route
 * POST /api/state-info
 * Returns India state-specific election data from static ECI dataset
 */

import { NextRequest, NextResponse } from 'next/server'
import { INDIAN_STATES_DATA } from '@/lib/indianElectionData'
import type { StateInfoRequest, StateElectionInfo, ApiResponse } from '@/types/india'

/**
 * Handle POST requests for state-specific election information.
 * Looks up the requested Indian state in the static ECI data store
 * and returns seat counts, upcoming elections, and official links.
 *
 * @param request - Incoming Next.js API request with StateInfoRequest body
 * @returns JSON ApiResponse<StateElectionInfo> with state data or 404 error
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as StateInfoRequest

    if (!body.state) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'State name required' },
        { status: 400 }
      )
    }

    const stateData = INDIAN_STATES_DATA.find((s) => s.stateName === body.state)

    if (!stateData) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: `Data not found for ${body.state}`,
        },
        { status: 404 }
      )
    }

    return NextResponse.json<ApiResponse<StateElectionInfo>>({
      success: true,
      data: stateData,
    })
  } catch (error) {
    console.error('State Info API error:', error)
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to fetch state data' },
      { status: 500 }
    )
  }
}
