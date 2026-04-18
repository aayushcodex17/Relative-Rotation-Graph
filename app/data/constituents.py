# Index constituent lists (NSE tickers with .NS suffix unless noted)
# Updated: April 2025. Constituents change quarterly — keep in sync with NSE rebalancing.

INDEX_CONSTITUENTS: dict[str, dict] = {

    # ── Nifty 50 ──────────────────────────────────────────────────────────────
    "^NSEI": {
        "label": "Nifty 50",
        "symbols": [
            "ADANIENT.NS", "ADANIPORTS.NS", "APOLLOHOSP.NS", "ASIANPAINT.NS", "AXISBANK.NS",
            "BAJAJ-AUTO.NS", "BAJAJFINSV.NS", "BAJFINANCE.NS", "BHARTIARTL.NS", "BPCL.NS",
            "BRITANNIA.NS", "CIPLA.NS", "COALINDIA.NS", "DIVISLAB.NS", "DRREDDY.NS",
            "EICHERMOT.NS", "ETERNAL.NS",   "GRASIM.NS",   "HCLTECH.NS",  "HDFCBANK.NS",
            "HDFCLIFE.NS",  "HEROMOTOCO.NS","HINDALCO.NS", "HINDUNILVR.NS","ICICIBANK.NS",
            "INDUSINDBK.NS","INFY.NS",      "ITC.NS",      "JSWSTEEL.NS", "KOTAKBANK.NS",
            "LT.NS",        "M&M.NS",       "MARUTI.NS",   "NESTLEIND.NS","NTPC.NS",
            "ONGC.NS",      "POWERGRID.NS", "RELIANCE.NS", "SBIN.NS",     "SHRIRAMFIN.NS",
            "SUNPHARMA.NS", "TATACONSUM.NS","TATAMOTORS.NS","TATASTEEL.NS","TCS.NS",
            "TECHM.NS",     "TITAN.NS",     "TRENT.NS",    "ULTRACEMCO.NS","WIPRO.NS",
        ],
    },

    # ── Sensex 30 (BSE — using NSE tickers for consistent yfinance data) ──────
    "^BSESN": {
        "label": "Sensex",
        "symbols": [
            "ADANIENT.NS", "ASIANPAINT.NS", "AXISBANK.NS",  "BAJAJ-AUTO.NS","BAJFINANCE.NS",
            "BHARTIARTL.NS","HCLTECH.NS",   "HDFCBANK.NS",  "HEROMOTOCO.NS","HINDALCO.NS",
            "HINDUNILVR.NS","ICICIBANK.NS", "INDUSINDBK.NS","INFY.NS",      "ITC.NS",
            "JSWSTEEL.NS",  "KOTAKBANK.NS", "LT.NS",        "M&M.NS",       "MARUTI.NS",
            "NESTLEIND.NS", "NTPC.NS",      "POWERGRID.NS", "RELIANCE.NS",  "SBIN.NS",
            "SUNPHARMA.NS", "TATAMOTORS.NS","TATASTEEL.NS", "TCS.NS",       "TITAN.NS",
        ],
    },

    # ── Bank Nifty (12 stocks) ────────────────────────────────────────────────
    "^NSEBANK": {
        "label": "Bank Nifty",
        "symbols": [
            "HDFCBANK.NS", "ICICIBANK.NS",  "AXISBANK.NS",  "KOTAKBANK.NS",
            "SBIN.NS",     "INDUSINDBK.NS", "BANDHANBNK.NS","FEDERALBNK.NS",
            "IDFCFIRSTB.NS","PNB.NS",       "BANKBARODA.NS","AUBANK.NS",
        ],
    },

    # ── Nifty Next 50 ─────────────────────────────────────────────────────────
    "^NSMIDCP": {
        "label": "Nifty Next 50",
        "symbols": [
            "ABB.NS",       "ADANIGREEN.NS","ADANIPOWER.NS","AMBUJACEM.NS", "ATGL.NS",
            "BEL.NS",       "BERGEPAINT.NS","BOSCHLTD.NS",  "CGPOWER.NS",   "CHOLAFIN.NS",
            "COLPAL.NS",    "CUMMINSIND.NS","DABUR.NS",     "DLF.NS",       "DMART.NS",
            "GODREJCP.NS",  "GODREJPROP.NS","HAVELLS.NS",   "ICICIPRULI.NS","ICICIGI.NS",
            "IOC.NS",       "IRCTC.NS",     "IRFC.NS",      "JIOFIN.NS",    "JINDALSTEL.NS",
            "LODHA.NS",     "MARICO.NS",    "MOTHERSON.NS", "NAUKRI.NS",    "NHPC.NS",
            "PIDILITIND.NS","PIIND.NS",     "POLYCAB.NS",   "RECLTD.NS",    "SBICARD.NS",
            "SBILIFE.NS",   "SIEMENS.NS",   "TIINDIA.NS",   "TORNTPHARM.NS","TRENT.NS",
            "TVSMOTOR.NS",  "UNIONBANK.NS", "VBL.NS",       "VEDL.NS",      "ZYDUSLIFE.NS",
            "MCDOWELL-N.NS","PGHH.NS",      "LUPIN.NS",     "MANKIND.NS",   "INDUSTOWER.NS",
        ],
    },

    # ── Nifty Midcap 50 ───────────────────────────────────────────────────────
    "^NSEMDCP50": {
        "label": "Midcap 50",
        "symbols": [
            "ASTRAL.NS",    "AUBANK.NS",    "BALKRISIND.NS","BHARATFORG.NS","BHEL.NS",
            "BIOCON.NS",    "CANBK.NS",     "CHOLAFIN.NS",  "COLPAL.NS",    "CONCOR.NS",
            "CROMPTON.NS",  "CUMMINSIND.NS","DLF.NS",       "ESCORTS.NS",   "GLENMARK.NS",
            "GODREJCP.NS",  "HAVELLS.NS",   "HPCL.NS",      "INDUSTOWER.NS","IPCALAB.NS",
            "IRCTC.NS",     "JINDALSTEL.NS","JUBLFOOD.NS",  "KANSAINER.NS", "LUPIN.NS",
            "M&MFIN.NS",    "MPHASIS.NS",   "NAUKRI.NS",    "NMDC.NS",      "OBEROIRLTY.NS",
            "OFSS.NS",      "PAGEIND.NS",   "PERSISTENT.NS","PETRONET.NS",  "PIIND.NS",
            "PIDILITIND.NS","POLYCAB.NS",   "SAIL.NS",      "SIEMENS.NS",   "SUNDARMFIN.NS",
            "SUNTV.NS",     "TATACHEM.NS",  "TATACOMM.NS",  "TIINDIA.NS",   "TRENT.NS",
            "TVSMOTOR.NS",  "UPL.NS",       "ZYDUSLIFE.NS", "ABCAPITAL.NS", "ABFRL.NS",
        ],
    },

    # ── Nifty Smallcap 100 (top 50 by liquidity — full 100 is too slow) ───────
    "^CNXSC": {
        "label": "Smallcap 100",
        "symbols": [
            "AAVAS.NS",    "ABFRL.NS",     "AIAENG.NS",    "AJANTPHARM.NS","ALKEM.NS",
            "ANGELONE.NS", "APLAPOLLO.NS", "APTUS.NS",     "ARCHEAN.NS",   "ASAHIINDIA.NS",
            "BSOFT.NS",    "CAPLIPOINT.NS","CESC.NS",      "CHALET.NS",    "CMSINFO.NS",
            "DATAPATTNS.NS","DEEPAKNTR.NS","DELHIVERY.NS", "DIXON.NS",     "EIDPARRY.NS",
            "ELGIEQUIP.NS","EMAMILTD.NS",  "ENDURANCE.NS", "EPLLTD.NS",    "FINEORG.NS",
            "GALAXYSURF.NS","GARFIBRES.NS","GLAXO.NS",     "GPPL.NS",      "GRINDWELL.NS",
            "HAPPSTMNDS.NS","HBLPOWER.NS", "IDFC.NS",      "IGPL.NS",      "IIFL.NS",
            "INOXWIND.NS", "JBCHEPHARM.NS","JKCEMENT.NS",  "JKPAPER.NS",   "JSWENERGY.NS",
            "KAJARIACER.NS","KALPATPOWR.NS","KPITTECH.NS", "KRBL.NS",      "LATENTVIEW.NS",
            "LICI.NS",     "LINDEINDIA.NS","LXCHEM.NS",    "MAHINDCIE.NS", "MMFL.NS",
        ],
    },

    # ── Nifty IT (10 stocks) ──────────────────────────────────────────────────
    "^CNXIT": {
        "label": "Nifty IT",
        "symbols": [
            "TCS.NS", "INFY.NS", "HCLTECH.NS", "WIPRO.NS", "TECHM.NS",
            "LTIM.NS", "MPHASIS.NS", "COFORGE.NS", "PERSISTENT.NS", "OFSS.NS",
        ],
    },
}
