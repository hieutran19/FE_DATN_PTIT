import { NextApiRequest, NextApiResponse } from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.query.token as string
  const handleVerify = async () => {}
  res.status(200).json({ status: token })
}
