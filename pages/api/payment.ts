import { NextApiRequest, NextApiResponse } from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { status } = req.query
  if (status === "success") {
    res.writeHead(302, { Location: "/payment-success" })
    res.end()
  } else {
    res.writeHead(302, { Location: "/payment-fail" })
    res.end()
  }
}
