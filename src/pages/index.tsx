import * as React from "react"
import Pagination from "react-responsive-pagination"
import numbro from "numbro"
import { useMedia } from "react-use"
import { format, fromUnixTime } from "date-fns"
import blockchain from "../modules/blockchain"
import Layout from "../components/layout"
import Seo from "../components/seo"

import "../components/pagination.css"

const formatBtcAmount = (input: number) => (input * 0.00000001).toFixed(8)

// 00000000000000000007878ec04bb2b2e12317804810f4c26033585b3f81ffaa for prod..
// 0000000000000000000521a9c16fdebace08f612340e64a5596ad83a080763c4 for test..
const fetchSingleBlock = async (blockHash: string) => {
  const res = await fetch(`https://blockchain.info/rawblock/${blockHash}`)
  return await res.json()
}

const IndexPage = () => {
  const isWide = useMedia("(min-width: 1440px)")
  const perPage = 5
  const [currentPage, setCurrentPage] = React.useState(0)
  const [totalPages, setTotalPages] = React.useState(0)
  const [blockHash, setBlockHash] = React.useState("")
  const [singleBlock, setSingleBlock] = React.useState<
    blockchain.Block | undefined
  >(undefined)
  const [transactions, setTransactions] = React.useState<
    blockchain.Transaction[]
  >([])

  React.useEffect(() => {
    if (blockHash.length === 64) {
      fetchSingleBlock(blockHash).then((data: blockchain.Block) => {
        setCurrentPage(1)
        setTotalPages(Math.ceil(data.tx.length / perPage))
        setTransactions(data.tx)
        data.tx = []
        setSingleBlock(data)
      })
    }
  }, [blockHash])

  const paginatedTranscationIndices = []

  for (let i = 0; i < perPage; i++) {
    paginatedTranscationIndices.push((currentPage - 1) * perPage + i)
  }

  const blockReward = transactions.reduce((p1, c1) => {
    if (c1.fee === 0) {
      p1 += c1.out.reduce((p2, c2) => (p2 += c2.value), 0)
    }

    return p1
  }, 0)

  return (
    <Layout>
      <Seo title="Home" />
      <input
        type="text"
        placeholder="Paste in some block hash to check.."
        className="search-input"
        value={blockHash}
        onChange={e => setBlockHash(e.target.value)}
      />
      {singleBlock ? (
        <>
          <div className="info-table">
            <table>
              <tbody>
                <tr>
                  <td>Hash</td>
                  <td>{singleBlock.hash}</td>
                </tr>
                {/* <tr>
            <td>Confirmations</td>
            <td></td>
          </tr> */}
                <tr>
                  <td>Timestamp</td>
                  <td>
                    {format(fromUnixTime(singleBlock.time), "yyyy-MM-dd HH:mm")}
                  </td>
                </tr>
                <tr>
                  <td>Height</td>
                  <td>
                    {numbro(singleBlock.height).format({
                      thousandSeparated: true,
                    }) + " WU"}
                  </td>
                </tr>
                {/* <tr>
            <td>Miner</td>
            <td></td>
          </tr> */}
                <tr>
                  <td>Number of Transactions</td>
                  <td>
                    {numbro(singleBlock.n_tx).format({
                      thousandSeparated: true,
                    })}
                  </td>
                </tr>
                {/* <tr>
            <td>Difficulty</td>
            <td></td>
          </tr> */}
                <tr>
                  <td>Merkle root</td>
                  <td>{singleBlock.mrkl_root}</td>
                </tr>
                <tr>
                  <td>Version</td>
                  <td>{singleBlock.ver}</td>
                </tr>
                <tr>
                  <td>Bits</td>
                  <td>
                    {numbro(singleBlock.bits).format({
                      thousandSeparated: true,
                    })}
                  </td>
                </tr>
                <tr>
                  <td>Weight</td>
                  <td>
                    {numbro(singleBlock.weight).format({
                      thousandSeparated: true,
                    })}
                  </td>
                </tr>
                <tr>
                  <td>Size</td>
                  <td>
                    {numbro(singleBlock.size).format({
                      thousandSeparated: true,
                    }) + " bytes"}
                  </td>
                </tr>
                <tr>
                  <td>Nonce</td>
                  <td>
                    {numbro(singleBlock.nonce).format({
                      thousandSeparated: true,
                    })}
                  </td>
                </tr>
                <tr>
                  <td>Transaction Volume</td>
                  <td>
                    {formatBtcAmount(
                      transactions.reduce(
                        (p1: number, c1: blockchain.Transaction) => {
                          return (p1 += c1.out.reduce((p2, c2) => {
                            return (p2 += c2.value)
                          }, 0))
                        },
                        0
                      ) - blockReward
                    ) + " BTC"}
                  </td>
                </tr>
                <tr>
                  <td>Block Reward</td>
                  <td>{formatBtcAmount(blockReward) + " BTC"}</td>
                </tr>
                <tr>
                  <td>Fee Reward</td>
                  <td>{formatBtcAmount(singleBlock.fee) + " BTC"}</td>
                </tr>
              </tbody>
            </table>
          </div>
          {transactions.length ? (
            <>
              {paginatedTranscationIndices.map(index => {
                const transaction = transactions[index]

                if (!transaction) {
                  return null
                }

                if (!isWide) {
                  return (
                    <div key={transaction.hash} className="transaction-grid">
                      <div>Fee</div>
                      <div>
                        {formatBtcAmount(transaction.fee)} BTC (
                        {(transaction.fee / transaction.size).toFixed(3)} sat/B
                        - {transaction.size} bytes)
                      </div>

                      <div>Hash</div>
                      <div>
                        <div>{transaction.hash}</div>
                        <div>
                          <span>
                            {format(
                              fromUnixTime(transaction.time),
                              "yyyy-MM-dd HH:mm"
                            ) + " "}
                          </span>
                          <span className="money-label">
                            {formatBtcAmount(
                              transaction.out.reduce(
                                (p, c) => (p += c.value),
                                0
                              )
                            ) + " BTC"}
                          </span>
                        </div>
                      </div>
                      <div>FROM</div>
                      <div>
                        {transaction.inputs.map((input, key) => {
                          return (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                              key={key}
                            >
                              <div>
                                {input.prev_out.addr &&
                                input.prev_out.addr.length
                                  ? input.prev_out.addr
                                  : "N/A"}
                              </div>
                              <div>
                                {formatBtcAmount(input.prev_out.value)} BTC
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      <div>TO</div>
                      <div>
                        {transaction.out.map((out, key) => {
                          return (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                              key={key}
                            >
                              <div key={key}>{out.addr}</div>
                              <div
                                key={key}
                                style={{
                                  whiteSpace: "nowrap",
                                  paddingLeft: "1rem",
                                }}
                              >
                                {formatBtcAmount(out.value)} BTC
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                }

                return (
                  <div key={transaction.hash} className="transaction-grid">
                    <div>Fee</div>
                    <div>
                      <p>{formatBtcAmount(transaction.fee)} BTC</p>
                      <p>
                        ({(transaction.fee / transaction.size).toFixed(3)} sat/B
                        - {transaction.size} bytes)
                      </p>
                    </div>
                    <div></div>
                    <div style={{ textAlign: "right" }}>
                      <span className="money-label">
                        {formatBtcAmount(
                          transaction.out.reduce((p, c) => (p += c.value), 0)
                        ) + " BTC"}
                      </span>
                    </div>

                    <div>Hash</div>
                    <div>{transaction.hash}</div>
                    <div></div>
                    <div style={{ textAlign: "right" }}>
                      {format(
                        fromUnixTime(transaction.time),
                        "yyyy-MM-dd HH:mm"
                      )}
                    </div>

                    <div></div>
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>FROM</div>
                        <div></div>
                      </div>
                      {transaction.inputs.map((input, key) => {
                        return (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                            key={key}
                          >
                            <div>
                              {input.prev_out.addr && input.prev_out.addr.length
                                ? input.prev_out.addr
                                : "N/A"}
                            </div>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                paddingLeft: "1rem",
                              }}
                            >
                              {formatBtcAmount(input.prev_out.value)} BTC
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <div>
                      <div>TO</div>
                      {transaction.out.map((out, key) => {
                        return <div key={key}>{out.addr}</div>
                      })}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div>　</div>
                      {transaction.out.map((out, key) => {
                        return (
                          <div key={key}>{formatBtcAmount(out.value)} BTC</div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
              <Pagination
                current={currentPage}
                total={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            <></>
          )}
        </>
      ) : (
        <></>
      )}
    </Layout>
  )
}
export default IndexPage
