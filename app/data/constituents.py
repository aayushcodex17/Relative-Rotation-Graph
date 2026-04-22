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

    # ── NSE F&O Segment (~180 stocks eligible for Futures & Options) ──────────
    # Source: NSE Securities available in F&O segment, April 2025.
    "FNO": {
        "label": "NSE F&O",
        "symbols": [
            # Banking & Financial Services
            "ABCAPITAL.NS",   "ANGELONE.NS",    "AXISBANK.NS",    "BAJAJFINSV.NS",  "BAJFINANCE.NS",
            "BANDHANBNK.NS",  "BANKBARODA.NS",  "BSE.NS",         "CANBK.NS",       "CDSL.NS",
            "CHOLAFIN.NS",    "FEDERALBNK.NS",  "HDFCAMC.NS",     "HDFCBANK.NS",    "HDFCLIFE.NS",
            "ICICIGI.NS",     "ICICIBANK.NS",   "ICICIPRULI.NS",  "IDFCFIRSTB.NS",  "IEX.NS",
            "INDUSINDBK.NS",  "JIOFIN.NS",      "KOTAKBANK.NS",   "L&TFH.NS",       "LICHSGFIN.NS",
            "LICI.NS",        "MANAPPURAM.NS",  "M&MFIN.NS",      "MCX.NS",         "MFSL.NS",
            "MUTHOOTFIN.NS",  "PFC.NS",         "PNB.NS",         "POONAWALLA.NS",  "RECLTD.NS",
            "SBICARD.NS",     "SBILIFE.NS",     "SBIN.NS",        "SHRIRAMFIN.NS",  "UNIONBANK.NS",
            # IT & Technology
            "BSOFT.NS",       "COFORGE.NS",     "HCLTECH.NS",     "INDIAMART.NS",   "INFY.NS",
            "INTELLECT.NS",   "KPITTECH.NS",    "LTIM.NS",        "LTTS.NS",        "MPHASIS.NS",
            "OFSS.NS",        "PERSISTENT.NS",  "TCS.NS",         "TECHM.NS",       "WIPRO.NS",
            # Automobiles & Auto Ancillaries
            "APOLLOTYRE.NS",  "ASHOKLEY.NS",    "BAJAJ-AUTO.NS",  "BALKRISIND.NS",  "BHARATFORG.NS",
            "BOSCHLTD.NS",    "EICHERMOT.NS",   "ESCORTS.NS",     "EXIDEIND.NS",    "HEROMOTOCO.NS",
            "M&M.NS",         "MARUTI.NS",      "MOTHERSON.NS",   "MRF.NS",         "TATAMOTORS.NS",
            "TVSMOTOR.NS",
            # Pharmaceuticals & Healthcare
            "ABBOTINDIA.NS",  "ALKEM.NS",       "APOLLOHOSP.NS",  "AUROPHARMA.NS",  "BIOCON.NS",
            "CIPLA.NS",       "DIVISLAB.NS",    "DRREDDY.NS",     "GLENMARK.NS",    "IPCALAB.NS",
            "LALPATHLAB.NS",  "LAURUSLABS.NS",  "LUPIN.NS",       "MANKIND.NS",     "METROPOLIS.NS",
            "SUNPHARMA.NS",   "SYNGENE.NS",     "TORNTPHARM.NS",  "ZYDUSLIFE.NS",
            # FMCG & Consumer Staples
            "ASIANPAINT.NS",  "BATAINDIA.NS",   "BERGEPAINT.NS",  "BRITANNIA.NS",   "COLPAL.NS",
            "DABUR.NS",       "EMAMILTD.NS",    "GODREJCP.NS",    "HINDUNILVR.NS",  "ITC.NS",
            "MARICO.NS",      "MCDOWELL-N.NS",  "NESTLEIND.NS",   "PAGEIND.NS",     "PIDILITIND.NS",
            "TATACONSUM.NS",  "UBL.NS",
            # Oil, Gas & Power
            "ATGL.NS",        "BPCL.NS",        "GAIL.NS",        "GSPL.NS",        "HINDPETRO.NS",
            "IGL.NS",         "IOC.NS",         "JSWENERGY.NS",   "NHPC.NS",        "NTPC.NS",
            "ONGC.NS",        "PETRONET.NS",    "POWERGRID.NS",   "TATAPOWER.NS",   "TORNTPOWER.NS",
            "ADANIGREEN.NS",  "ADANIPOWER.NS",
            # Metals & Mining
            "APLAPOLLO.NS",   "COALINDIA.NS",   "HINDALCO.NS",    "HINDCOPPER.NS",  "JINDALSTEL.NS",
            "JSWSTEEL.NS",    "NATIONALUM.NS",  "NMDC.NS",        "SAIL.NS",        "TATACHEM.NS",
            "TATASTEEL.NS",   "VEDL.NS",
            # Capital Goods & Industrials
            "ABB.NS",         "ADANIENT.NS",    "ADANIPORTS.NS",  "BEL.NS",         "BHEL.NS",
            "CGPOWER.NS",     "CONCOR.NS",      "CUMMINSIND.NS",  "GMRINFRA.NS",    "GRASIM.NS",
            "HAL.NS",         "HAVELLS.NS",     "INDUSTOWER.NS",  "IRFC.NS",        "LT.NS",
            "MAZAGON.NS",     "POLYCAB.NS",     "RVNL.NS",        "SIEMENS.NS",     "TIINDIA.NS",
            # Cement
            "ACC.NS",         "AMBUJACEM.NS",   "DALBHARAT.NS",   "RAMCOCEM.NS",    "SHREECEM.NS",
            "ULTRACEMCO.NS",
            # Chemicals
            "AARTIIND.NS",    "CHAMBLFERT.NS",  "DEEPAKNTR.NS",   "GNFC.NS",        "PIIND.NS",
            "SRF.NS",         "UPL.NS",
            # Realty
            "DLF.NS",         "GODREJPROP.NS",  "LODHA.NS",       "OBEROIRLTY.NS",
            # Consumer Discretionary, Retail & Others
            "ABFRL.NS",       "ASTRAL.NS",      "BHARTIARTL.NS",  "CROMPTON.NS",    "DELHIVERY.NS",
            "DMART.NS",       "DIXON.NS",       "ETERNAL.NS",     "INDHOTEL.NS",    "INDIGO.NS",
            "IRCTC.NS",       "JUBLFOOD.NS",    "KAJARIACER.NS",  "LINDEINDIA.NS",  "NAUKRI.NS",
            "NYKAA.NS",       "PAYTM.NS",       "POLICYBZR.NS",   "PVRINOX.NS",     "RELIANCE.NS",
            "SUNTV.NS",       "TATACOMM.NS",    "TITAN.NS",       "TRENT.NS",       "VOLTAS.NS",
        ],
    },
}
