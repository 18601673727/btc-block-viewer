declare module blockchain {
  export interface Block {
    hash: string
    ver: number
    prev_block: string
    mrkl_root: string
    time: number
    bits: number
    nonce: number
    n_tx: number
    size: number
    fee: number
    block_index: number
    main_chain: boolean
    weight: number
    height: number
    received_time: number
    relayed_by: string
    tx: Transaction[]
  }

  export interface Transaction {
    hash: string
    ver: number
    vin_sz: number
    vout_sz: number
    size: number
    weight: number
    fee: number
    relayed_by: string
    lock_time: number
    tx_index: number
    double_spend: boolean
    time: number
    block_index: number
    block_height: number
    inputs: Input[]
    out: Out[]
  }

  export interface SpendingOutpoint {
    tx_index: number
    n: number
  }

  export interface PrevOut {
    addr: string
    spent: boolean
    script: string
    spending_outpoints: SpendingOutpoint[]
    tx_index: number
    value: number
    n: number
    type: number
  }

  export interface Input {
    sequence: number
    witness: string
    script: string
    index: number
    prev_out: PrevOut
  }

  export interface Out {
    type: number
    spent: boolean
    value: number
    spending_outpoints: any[]
    n: number
    tx_index: any
    script: string
    addr: string
  }
}

export default blockchain
